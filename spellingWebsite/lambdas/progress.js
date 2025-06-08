// Lambda for GET and PUT /api/progress endpoints (Node.js 22, ES module syntax)
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();
const dynamo = DynamoDBDocumentClient.from(client);

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
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
}

async function putProgress(userId, wordId, progress) {
  const params = {
    TableName: 'spellingProgress',
    Key: { userId, wordId },
    UpdateExpression: 'set progress = :p',
    ExpressionAttributeValues: { ':p': progress },
    ReturnValues: 'ALL_NEW'
  };
  try {
    const result = await dynamo.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result.Attributes)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
}

export const handler = async (event) => {
  const userId = event.requestContext.authorizer.claims.sub;

  if (event.httpMethod === 'GET' && event.resource === '/api/progress') {
    return getProgress(userId);
  }

  if (event.httpMethod === 'PUT' && event.resource === '/api/progress/{wordId}') {
    const wordId = event.pathParameters.wordId;
    const body = JSON.parse(event.body);
    return putProgress(userId, wordId, body.progress);
  }

  // Default: Not found
  return {
    statusCode: 404,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ error: 'Not found' })
  };
}; 