import { APIGatewayEvent } from "aws-lambda";
import { client } from "../../utils/dynamoClient";
import crypto from 'crypto';
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import {responseHeaders} from "../../utils/headers";

export const createSubtaskHandler = async (event: APIGatewayEvent) => {
    if (event.body && event.requestContext.authorizer && event.pathParameters) {
        const tableName = process.env.PROJECTS_TABLE; // DynamoDB table in SAM template
        const subtask = JSON.parse(event.body);
        const { Subtask: description, Status: status } = subtask;
        const userId = event.requestContext.authorizer.claims.sub; // Get userId from event
        const projectId = event.pathParameters.ProjectId;
        const taskId = event.pathParameters.TaskId;
        const subtaskId = crypto.randomUUID();

        if (!description || !status) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Subtask description and status are required" }),
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            };
        }

        if (!projectId || !taskId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "ProjectId and TaskId are required" }),
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
                ConditionExpression: "attribute_exists(Tasks.#TaskId)",
                UpdateExpression: "SET Tasks.#TaskId.Subtasks.#SubtaskId = :SubtaskData",
                ExpressionAttributeNames: {
                    "#TaskId": taskId,
                    "#SubtaskId": subtaskId,
                },
                ExpressionAttributeValues: {
                    ":SubtaskData": {
                        "Description": description,
                        "Status": status,
                    }
                },
            }));

            return {
                statusCode: 201,
                body: JSON.stringify({ message: "Created subtask" }),
                headers: responseHeaders
            };
        } catch (e: any) {
            console.error("Error updating subtask:", {
                userId,
                projectId,
                taskId,
                subtaskId,
                error: e.message
            });
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "Failed to create subtask",
                    error: e.message,
                }),
                headers: responseHeaders
            };
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Must provide body, user, and path parameters" }),
            headers: responseHeaders
        };
    }
};
