import { client } from "../../utils/dynamoClient";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";
import crypto from "crypto";

export const createTaskHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.warn("No table name set in environment variables");
        throw new Error("PROJECTS_TABLE is not set in environment variables");
    }

    if (!event.body || !event.requestContext.authorizer || !event.pathParameters) {
        console.info("Missing required parameters:", {
            body: event.body,
            context: event.requestContext,
            path: event.pathParameters,
        });
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Body and authorization are required" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    const taskProperties = JSON.parse(event.body);
    const projectId = event.pathParameters.ProjectId;
    const { TaskDescription } = taskProperties;
    const userId = event.requestContext.authorizer.claims.sub; // Get userId from event provided by cognito
    const taskId = crypto.randomUUID();

    // Validate TaskDescription
    if (!TaskDescription) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "TaskDescription is required" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    try {
        await client.send(new UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            UpdateExpression: "SET Tasks.#TaskId = :TaskData",
            ExpressionAttributeNames: {
                "#TaskId": taskId,
            },
            ExpressionAttributeValues: {
                ":TaskData": {
                    "Description": TaskDescription,
                    "Status": false,
                    "Subtasks": {},
                },
            },
        }));

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Created task" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    } catch (error: any) {
        console.error("Error creating task:", {
            userId,
            projectId,
            taskId,
            error: error.message,
        });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to create task", error: error.message }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
};
