import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';

const config: DynamoDBClient = new DynamoDBClient({
    region: "us-east-1",
    logger: console,
    // endpoint: "http://host.docker.internal:8000"
});

export const client: DynamoDBDocumentClient = DynamoDBDocumentClient.from(config);
