import { APIGatewayProxyResult, PostConfirmationTriggerEvent} from 'aws-lambda';
import crypto from 'crypto';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { client } from '../../utils/dynamoClient';
const { createTasks } = require('../../utils/tasks');

import {responseHeaders} from "../../utils/headers";


export const demoProjectHandler = async (event: PostConfirmationTriggerEvent): Promise<APIGatewayProxyResult> => {
    const tableName = process.env.PROJECTS_TABLE;

    if (!tableName) {
        throw new Error('PROJECTS_TABLE environment variable is not set.');
    }

    if (!event.userName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Request authorization are required" }),
            headers: responseHeaders
        };
    }

    const userId = event.userName;

    try {
        const projectId = crypto.randomUUID();
        await client.send(
            new PutCommand({
                TableName: tableName,
                Item: {
                    UserId: userId,
                    ProjectId: projectId,
                    Project: 'Learn Safe Scheme',
                    Status: false,
                    Tasks: createTasks(),
                },
            }),
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Created project', ProjectId: projectId }),
            headers: responseHeaders
        };
    } catch (error: any) {
        console.error('Error creating project:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to create project',
                error: error.message,
            }),
            headers: responseHeaders
        };
    }
};
