// Create a DocumentClient that represents the query to add an item
import {DynamoDBClient,} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const crypto = require('crypto');

// Get the DynamoDB table name from environment variables
const projectTable = process.env.PROJECTS_TABLE;

// Function to get user from table
export const createProjectHandler = async (event) => {
    if (!event.body) {
        console.error("Invalid project:", event.body);
        throw new Error(`${event.body} is not applicable`);
    }

    const project = event.body;
    const params = {
        TableName: projectTable,
        Item: {
            userID: project.userID,
            projectID: crypto.randomBytes(16).toString('hex'),
            projectName: project.projectName,
            tasks: project.tasks,


        }
    }

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.info('Successfully created project:', data);
    } catch (e) {
        console.error(e);
    }


};
