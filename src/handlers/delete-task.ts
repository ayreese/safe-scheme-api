import { client } from "../../utils/dynamoClient";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";
import {responseHeaders} from "../../utils/headers";

export const deleteTaskHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.error("No table name provided");
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "No table name provided" }),
            headers: responseHeaders
        };
    }

    if (!event.pathParameters || !event.pathParameters.UserId || !event.pathParameters.ProjectId || !event.pathParameters.TaskId) {
        console.log("parameters:", event.pathParameters);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "UserId, ProjectId, and TaskId must be provided." }),
            headers: responseHeaders
        };
    }

    const userId = event.pathParameters.UserId;
    const projectId = event.pathParameters.ProjectId;
    const taskId = event.pathParameters.TaskId;

    if (!taskId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "task not found" }),
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
            ConditionExpression: "attribute_exists(Tasks.#TaskId)",
            UpdateExpression: 'REMOVE Tasks.#TaskId',
            ExpressionAttributeNames: {
                "#TaskId": taskId,
            },
        }));

        return {
            statusCode: 204,
            headers: responseHeaders
        };
    } catch (error: any) {
        console.error("Error deleting task:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to delete task", error: error.message }),
            headers: responseHeaders
        };
    }
};
