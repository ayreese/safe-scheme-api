import { client } from "../../utils/dynamoClient";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";

export const deleteTaskHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.error("No table name provided");
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "No table name provided" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    if (!event.pathParameters || !event.pathParameters.UserId || !event.pathParameters.ProjectId || !event.pathParameters.TaskId) {
        console.log("parameters:", event.pathParameters);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "UserId, ProjectId, and TaskId must be provided." }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    const userId = event.pathParameters.UserId;
    const projectId = event.pathParameters.ProjectId;
    const taskId = event.pathParameters.TaskId;

    if (!taskId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "task not found" }),
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
            UpdateExpression: 'REMOVE Tasks.#TaskId',
            ExpressionAttributeNames: {
                "#TaskId": taskId,
            },
        }));

        return {
            statusCode: 204,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    } catch (error: any) {
        console.error("Error deleting task:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to delete task", error: error.message }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
};
