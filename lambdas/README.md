# Lambda Function for Spelling Progress API

This folder contains the AWS Lambda function for the SpellingNinjas progress tracking API.

## Function

- `progress.js`: Handles both GET and PUT for /api/progress endpoints:
  - **GET /api/progress**: Fetch all progress for the current user from DynamoDB.
  - **PUT /api/progress/{wordId}**: Update progress for a specific word for the current user in DynamoDB.

## DynamoDB Table
- Table name: `spellingProgress`
- Partition key: `userId` (string)
- Sort key: `wordId` (string)
- Attribute: `progress` (object or string, stores progress data)

## Deployment
- Deploy `progress.js` as a Lambda function in AWS (Node.js 20+ runtime, ES module syntax).
- Attach an IAM role with permissions for DynamoDB access (read/write on `spellingProgress`).
- Connect this Lambda to both GET and PUT API Gateway routes:
  - GET `/api/progress`
  - PUT `/api/progress/{wordId}`
- Enable AWS Cognito Authorizer on the API Gateway for authentication.

## Environment
- Node.js 20.x or 22.x runtime
- AWS SDK v3 (pre-installed in Lambda)

## Example Event (PUT)
```
{
  "requestContext": {
    "authorizer": {
      "claims": {
        "sub": "USER_ID"
      }
    }
  },
  "pathParameters": {
    "wordId": "WORD_ID"
  },
  "body": "{\"progress\": { ... }}"
}
``` 