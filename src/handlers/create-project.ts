import {APIGatewayEvent, APIGatewayProxyResult} from "aws-lambda";
import crypto from 'crypto';
import {PutCommand} from "@aws-sdk/lib-dynamodb";
import {client} from "../../utils/dynamoClient";
import {responseHeaders} from "../../utils/headers";
const {createPhases} = require("../../utils/functions");

export const createProjectHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const tableName = process.env.PROJECTS_TABLE;

    if (!tableName) {
        throw new Error("PROJECTS_TABLE environment variable is not set.");
    }

    if (!event.body || !event.requestContext.authorizer) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Request body and authorization are required"}),
            headers: responseHeaders
        };
    }

    const project = JSON.parse(event.body);

    const {Name: name, Phases: phasesArray} = project;
    const userId = event.requestContext.authorizer.claims.sub;

    if (!name || !phasesArray) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Project name and status are required"}),
            headers: responseHeaders
        };
    }



    try {
        const projectId = crypto.randomUUID();
        const data = await client.send(new PutCommand({
            TableName: tableName,
            Item: {
                UserId: userId,
                ProjectId: projectId,
                Project: name,
                Phases: createPhases(phasesArray),
                Status: false
            }
        }));
        const statusCode = data.$metadata.httpStatusCode
        return {
            statusCode: statusCode || 200,
            body: JSON.stringify({message: "Created project", ProjectId: projectId}),
            headers: responseHeaders
        };
    } catch (error: any) {
        console.error("Error creating project:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to create project",
                error: error.message,
            }),
            headers: responseHeaders
        };
    }
};
