"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editSubtaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const headers_1 = require("../../utils/headers");
const editSubtaskHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.error("No table name provided");
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "No table name provided" }),
            headers: headers_1.responseHeaders
        };
    }
    if (!event.body || !event.requestContext.authorizer || !event.pathParameters) {
        console.error("Function parameters not provided:", event);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing required parameters (body, user, taskId, subtaskId)" }),
            headers: headers_1.responseHeaders
        };
    }
    const userId = event.requestContext.authorizer.claims.sub;
    const subtaskParameters = JSON.parse(event.body);
    const { Description: description, Status: status } = subtaskParameters;
    const projectId = event.pathParameters.ProjectId;
    const taskId = event.pathParameters.TaskId;
    const subtaskId = event.pathParameters.SubtaskId;
    if (!taskId || !subtaskId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "TaskId and SubtaskId must be provided" }),
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
            UpdateExpression: 'SET Tasks.#TaskId.Subtasks.#SubtaskId.Description = :Description, Tasks.#TaskId.Subtasks.#SubtaskId.Status = :Status',
            ExpressionAttributeNames: {
                "#TaskId": taskId,
                "#SubtaskId": subtaskId,
            },
            ExpressionAttributeValues: {
                ":Description": description,
                ":Status": status,
            },
        }));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Subtask updated successfully" }),
            headers: headers_1.responseHeaders
        };
    }
    catch (error) {
        console.error("Error updating subtask:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Failed to update subtask ${subtaskId}`, error: error.message }),
            headers: headers_1.responseHeaders
        };
    }
};
exports.editSubtaskHandler = editSubtaskHandler;
