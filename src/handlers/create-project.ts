import { APIGatewayEvent } from "aws-lambda";
import crypto from 'crypto';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../../utils/dynamoClient";

export const createProjectHandler = async (event: APIGatewayEvent) => {
    if (!event.body || !event.requestContext.authorizer) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Request body and authorization are required" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    const project = JSON.parse(event.body);
    const tableName = process.env.PROJECTS_TABLE;

    if (!tableName) {
        throw new Error("PROJECTS_TABLE environment variable is not set.");
    }

    const { Project: projectName, Status: status } = project;
    const userId = event.requestContext.authorizer.claims.sub; // Get userId from event

    if (!projectName || !status) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Project name and status are required" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    try {
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

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Created project" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    } catch (error: any) {
        console.error("Error creating project:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to create project",
                error: error.message,
            }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
};
