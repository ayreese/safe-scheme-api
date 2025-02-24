/*
To create a userID to test function use:
const userId = crypto.randomBytes(8).toString('hex');
*/

import {client} from "../../utils/dynamoClient.mjs";
import crypto from 'crypto';
import {PutCommand} from "@aws-sdk/lib-dynamodb";

export const createProjectHandler = async (event) => {
    const project = JSON.parse(event.body);
    const tableName = process.env.PROJECTS_TABLE; // DynamoDB table in SAM template
    const {Project: projectName, Status: status} = project;
    const userId = event.requestContext.identity.user; // Get userId from event provided by cognito

    try {
        // Put item into DynamoDB database using PutCommand
        await client.send(new PutCommand({
            TableName: tableName,
            Item: {
                UserId: userId,
                ProjectId: crypto.randomUUID(),
                Project: projectName,
                Status: status,
                Tasks: {},
            }
        }));
        // Return 201 and message if successful
        return {
            statusCode: 201,
            body: JSON.stringify({message: "Created project"})
        };
    } catch (e) {
        // Return 500 on failure
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Failed to create project", error: e.message})
        };
    }
};
