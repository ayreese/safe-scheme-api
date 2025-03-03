import { APIGatewayProxyResult, PostConfirmationTriggerEvent } from 'aws-lambda';
import crypto from 'crypto';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { client } from '../../utils/dynamoClient'; // Your DynamoDB client
import { createTasks } from '../../utils/tasks'; // A helper function that creates tasks

/**
 * This function is triggered by Cognito after user confirmation.
 * It will create a demo project for the new user.
 */
export const demoProjectHandler = async (event: PostConfirmationTriggerEvent): Promise<APIGatewayProxyResult> => {
    const tableName = process.env.PROJECTS_TABLE;

    if (!tableName) {
        throw new Error('PROJECTS_TABLE environment variable is not set.');
    }

    const userId = event.request.userAttributes.sub; // Use 'sub' as the user identifier

    try {
        const projectId = crypto.randomUUID(); // Generate a unique project ID
        await client.send(
            new PutCommand({
                TableName: tableName,
                Item: {
                    UserId: userId,
                    ProjectId: projectId,
                    Project: 'Learn Safe Scheme', // A demo project
                    Status: false, // Project status (e.g., not started)
                    Tasks: createTasks(), // Initial tasks
                },
            }),
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Created project', ProjectId: projectId }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error: any) {
        console.error('Error creating project:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to create project',
                error: error.message,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
};
