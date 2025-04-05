"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubtaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const headers_1 = require("../../utils/headers");
const deleteSubtaskHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.warn("No table name provided");
        throw new Error("No tableName provided");
    }
    if (!event.requestContext.authorizer) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Unauthorized" }),
            headers: headers_1.responseHeaders
        };
    }
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Subtasks parameters must be provided" }),
            headers: headers_1.responseHeaders
        };
    }
    const userId = event.requestContext.authorizer.claims.sub;
    const subtaskParameters = JSON.parse(event.body);
    const { ProjectId: projectId, Phase: phase, TaskId: taskId, SubtaskId: subtaskId } = subtaskParameters;
    if (!userId || !projectId || !taskId || !subtaskId) {
        console.log("Missing parameters:", { userId, projectId, taskId, subtaskId });
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing required parameters." }),
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
            ConditionExpression: "attribute_exists(Phases.#Phase.#TaskId.subtasks.#SubtaskId)",
            UpdateExpression: 'REMOVE Phases.#Phase.#TaskId.subtasks.#SubtaskId',
            ExpressionAttributeNames: {
                "#Phase": phase,
                "#TaskId": taskId,
                "#SubtaskId": subtaskId,
            },
        }));
        return {
            statusCode: 204, // Successfully deleted, no content
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
    catch (error) {
        console.error("Error deleting subtask:", { userId, projectId, taskId, subtaskId, error: error.message });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to delete subtask", error: error.message }),
            headers: headers_1.responseHeaders
        };
    }
};
exports.deleteSubtaskHandler = deleteSubtaskHandler;
