// Lambda for GET and PUT /api/progress endpoints (Node.js 22, ES module syntax)
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient,
   QueryCommand,
   ScanCommand,
   UpdateCommand } from '@aws-sdk/lib-dynamodb';

const DEBUG = false; // Set to true to enable debug logging

const client = new DynamoDBClient();
const dynamo = DynamoDBDocumentClient.from(client);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS'
};

async function getProgress(userId) {
  const params = {
    TableName: 'spellingProgress',
    KeyConditionExpression: 'userId = :uid',
    ExpressionAttributeValues: { ':uid': userId }
  };
  if (DEBUG) console.log('DynamoDB Query params:', params);
  if (DEBUG) console.log('Query start', Date.now());
  try {
    const result = await dynamo.send(new QueryCommand(params));
    if (DEBUG) console.log('Query end', Date.now());
    if (DEBUG) console.log('DynamoDB Query result:', result);
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result.Items)
    };
  } catch (err) {
    console.error('DynamoDB Query error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message })
    };
  }
}

async function putProgress(userId, wordId, progress) {
  const params = {
    TableName: 'spellingProgress',
    Key: { userId, wordId },
    UpdateExpression: 'SET progress = list_append(if_not_exists(progress, :empty_list), :new)',
    ExpressionAttributeValues: {
      ':new': progress, // This should be an array of attempts (usually with one new attempt)
      ':empty_list': []
    },
    ReturnValues: 'ALL_NEW'
  };
  try {
    await dynamo.send(new UpdateCommand(params));
    
    // Return the complete progress data for all words
    return await getProgress(userId);
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message })
    };
  }
}

async function deduplicateAllUsers() {
  const params = { TableName: "spellingProgress" };
  let updatedCount = 0;

  let lastEvaluatedKey = undefined;

  do {
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const result = await dynamo.send(new ScanCommand(params));

    for (const item of result.Items) {
      if (!item.progress || !Array.isArray(item.progress)) continue;

      const seen = new Set();
      const dedupedProgress = [];

      for (const p of item.progress) {
        const id = `${p.attempt}|${p.correct}|${p.date}`;
        if (!seen.has(id)) {
          seen.add(id);
          dedupedProgress.push(p);
        }
      }

      if (dedupedProgress.length < item.progress.length) {
        await dynamo.send(
          new UpdateCommand({
            TableName: "spellingProgress",
            Key: { userId: item.userId, wordId: item.wordId },
            UpdateExpression: "SET progress = :new",
            ExpressionAttributeValues: { ":new": dedupedProgress },
          })
        );
        updatedCount++;
        if (DEBUG) console.log(`Updated userId=${item.userId}, wordId=${item.wordId}`);
      }
    }

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      message: `Deduplication complete. Updated ${updatedCount} items.`,
    }),
  };
}

export const handler = async (event) => {
  if (DEBUG) console.log('--- Lambda invoked ---');
  if (DEBUG) console.log('Event:', JSON.stringify(event));
  if (DEBUG) console.log('RouteKey:', event.routeKey);

  if (event.deduplicateAll === true) {
    if (DEBUG) console.log('Deduplicating all users');
    if (DEBUG) console.log(event);
    return await deduplicateAllUsers();
  }

  if (event.requestContext && event.requestContext.http && event.requestContext.http.method === 'OPTIONS') {
    if (DEBUG) console.log('OPTIONS preflight');
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
  if (DEBUG) console.log('Extracted userId:', userId);

  if (!userId) {
    console.error('No Cognito sub found in event:', JSON.stringify(event));
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({error: 'Unauthorized: No Cognito sub found' })
    };
  }

  if (event.routeKey === 'GET /api/progress') {
    if (DEBUG) console.log('Handling GET /api/progress for userId:', userId);
    try {
      const result = await getProgress(userId);
      if (DEBUG) console.log('DynamoDB GET result:', result);
      return result;
    } catch (err) {
      console.error('Error in getProgress:', err);
      throw err;
    }
  }

  if (event.routeKey === 'PUT /api/progress/{wordId}') {
    const wordId = event.pathParameters.wordId;
    let progress;
    try {
      if (!event.body) {
        console.error('Missing request body');
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Missing request body' })
        };
      }
      const tmpbody = JSON.parse(event.body);
      if (!('progress' in tmpbody)) {
        console.error('Missing progress property in body');
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Missing progress property in body' })
        };
      }
      progress = tmpbody.progress;
      if (DEBUG) console.log('Handling PUT /api/progress for userId:', userId, 'wordId:', wordId, 'progress:', progress);
      const result = await putProgress(userId, wordId, progress);
      if (DEBUG) console.log('DynamoDB PUT result:', result);
      return result;
    } catch (e) {
      console.error('Error in putProgress:', e);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid JSON body or DynamoDB error' })
      };
    }
  }

  // Default: Not found
  console.error('Route not found:', event.routeKey);
  return {
    statusCode: 404,
    headers: corsHeaders,
    body: JSON.stringify({ error: 'Not found:86' })
  };
}; 