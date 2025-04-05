import {APIGatewayEvent} from "aws-lambda";
import {client} from "../../utils/dynamoClient";
import crypto from 'crypto';
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {responseHeaders} from "../../utils/headers";

export const createSubtaskHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE; // DynamoDB table in SAM template

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Body is required"}),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    if (!event.requestContext.authorizer) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Token is required"}),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    const userId = event.requestContext.authorizer.claims.sub; // Get userId from event
    const subtask = JSON.parse(event.body);
    const {ProjectId: projectId, TaskId: taskId, Phase: phase, Name: name} = subtask;
    const subtaskId = crypto.randomUUID();

    if (!name) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Subtask name is required"}),
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
            body: JSON.stringify({message: "ProjectId and TaskId are required"}),
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
            UpdateExpression: "SET Phases.#Phase.#TaskId.subtasks.#SubtaskId = :SubtaskData",
            ExpressionAttributeNames: {
                "#Phase": phase,
                "#TaskId": taskId,
                "#SubtaskId": subtaskId,
            },
            ExpressionAttributeValues: {
                ":SubtaskData": {
                    "name": name,
                    "status": false,
                }
            },
        }));

        return {
            statusCode: 201,
            body: JSON.stringify({message: "Created subtask"}),
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


};
