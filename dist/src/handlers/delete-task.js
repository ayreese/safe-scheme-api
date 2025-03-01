"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const headers_1 = require("../../utils/headers");
const deleteTaskHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.error("No table name provided");
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "No table name provided" }),
            headers: headers_1.responseHeaders
        };
    }
    if (!event.pathParameters || !event.pathParameters.UserId || !event.pathParameters.ProjectId || !event.pathParameters.TaskId) {
        console.log("parameters:", event.pathParameters);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "UserId, ProjectId, and TaskId must be provided." }),
            headers: headers_1.responseHeaders
        };
    }
    const userId = event.pathParameters.UserId;
    const projectId = event.pathParameters.ProjectId;
    const taskId = event.pathParameters.TaskId;
    if (!taskId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "task not found" }),
            headers: headers_1.responseHeaders
        };
    }
    try {
        await dynamoClient_1.client.send(new lib_dynamodb_1.UpdateCommand({
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
            headers: headers_1.responseHeaders
        };
    }
    catch (error) {
        console.error("Error deleting task:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to delete task", error: error.message }),
            headers: headers_1.responseHeaders
        };
    }
};
exports.deleteTaskHandler = deleteTaskHandler;
