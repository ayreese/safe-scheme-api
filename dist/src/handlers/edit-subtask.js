"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editSubtaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const headers_1 = require("../../utils/headers");
const editSubtaskHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.warn(`Environment variable PROJECT_TABLE is missing, cannot query DynamoDB`);
        throw new Error("Database error");
    }
    if (!event.requestContext.authorizer) {
        console.error("missing authorizer event, unable to get user");
        console.log("Event received", event);
        return {
            statusCode: 401,
            body: JSON.stringify({ message: "request missing user, token not read" }),
            headers: headers_1.responseHeaders
        };
    }
    if (!event.body || !event.pathParameters) {
        console.log("Event body:", event.body);
        console.log("Event path parameters:", event.pathParameters);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing required parameters (body, user, taskId, subtaskId)" }),
            headers: headers_1.responseHeaders
        };
    }
    const userId = event.requestContext.authorizer.claims.sub;
    const subtaskParameters = JSON.parse(event.body);
    const { Phase: phase, Status: status } = subtaskParameters;
    if (!phase || !status) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing Phase or Status in subtask parameters" }),
            headers: headers_1.responseHeaders
        };
    }
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
            UpdateExpression: 'SET Phases.#Phase.#TaskId.subtasks.#SubtaskId.#Status = :Status',
            ExpressionAttributeNames: {
                "#Phase": phase,
                "#TaskId": taskId,
                "#SubtaskId": subtaskId,
                "#Status": "status"
            },
            ExpressionAttributeValues: {
                ":Status": status
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
