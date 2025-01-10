import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';


const config = new DynamoDBClient({
    region: "us-east-1",
    logger: console,
    endpoint: "http://safe-scheme-db:8000",
});

export const client = DynamoDBDocumentClient.from(config);
