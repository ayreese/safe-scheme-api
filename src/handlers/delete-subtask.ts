import { client } from "../../utils/dynamoClient";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";
import {responseHeaders} from "../../utils/headers";

export const deleteSubtaskHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.warn("No table name provided");
        throw new Error("No tableName provided");
    }

    if (!event.requestContext.authorizer || !event.pathParameters) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "User and parameters must be provided" }),
            headers: responseHeaders
        };
    }

    const userId = event.requestContext.authorizer.claims.sub;
    const projectId = event.pathParameters.ProjectId;
    const taskId = event.pathParameters.TaskId;
    const subtaskId = event.pathParameters.SubtaskId;

    if (!userId || !projectId || !taskId || !subtaskId) {
        console.log("Missing parameters:", { userId, projectId, taskId, subtaskId });
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing required parameters." }),
            headers: responseHeaders
        };
    }

    try {
        await client.send(new UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            ConditionExpression: "attribute_exists(Tasks.#TaskId.Subtasks.#SubtaskId)",
            UpdateExpression: 'REMOVE Tasks.#TaskId.Subtasks.#SubtaskId',
            ExpressionAttributeNames: {
                "#TaskId": taskId,
                "#SubtaskId": subtaskId,
            },
        }));

        return {
            statusCode: 204,  // Successfully deleted, no content
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    } catch (error: any) {
        console.error("Error deleting subtask:", { userId, projectId, taskId, subtaskId, error: error.message });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to delete subtask", error: error.message }),
            headers: responseHeaders
        };
    }
};
