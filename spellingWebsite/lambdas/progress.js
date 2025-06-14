// Lambda for GET and PUT /api/progress endpoints (Node.js 22, ES module syntax)
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

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
  try {
    const result = await dynamo.send(new QueryCommand(params));
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result.Items)
    };
  } catch (err) {
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
    const result = await dynamo.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Attributes)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message })
    };
  }
}

export const handler = async (event) => {
  // return {
  //   statusCode: 200,
  //   headers: { 'Access-Control-Allow-Origin': '*' },
  //   body: JSON.stringify(event)
  // }

  if (event.requestContext.http.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  const userId = event.requestContext.authorizer?.jwt?.claims?.sub;

  if (!userId) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({error: 'Unauthorized: No Cognito sub found' })
    };
  }

  if (event.routeKey === 'GET /api/progress') {
    return getProgress(userId);
  }

  if (event.routeKey === 'PUT /api/progress/{wordId}') {
    const wordId = event.pathParameters.wordId;
    let progress;
    try {
      if (!event.body) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Missing request body' })
        };
      }
      const tmpbody = JSON.parse(event.body);
      if (!('progress' in tmpbody)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Missing progress property in body' })
        };
      }
      progress = tmpbody.progress;
    } catch (e) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid JSON body' })
      };
    }
    return await putProgress(userId, wordId, progress);
    
  }

  // Default: Not found
  return {
    statusCode: 404,
    headers: corsHeaders,
    body: JSON.stringify({ error: 'Not found:86' })
  };
}; 