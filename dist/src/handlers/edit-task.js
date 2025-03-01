"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const headers_1 = require("../../utils/headers");
const editTaskHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.warn(`No table name provided`);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "No table name provided" }),
            headers: headers_1.responseHeaders
        };
    }
    if (!event.body || !event.pathParameters || !event.requestContext.authorizer) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing required parameters (body, user, taskId)" }),
            headers: headers_1.responseHeaders
        };
    }
    const taskParameters = JSON.parse(event.body);
    const { Description: description, Status: status } = taskParameters;
    const projectId = event.pathParameters.ProjectId;
    const taskId = event.pathParameters.TaskId;
    const userId = event.requestContext.authorizer.claims.sub;
    if (!taskId) {
        console.log("taskId missing");
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "TaskId must be provided" }),
            headers: headers_1.responseHeaders
        };
    }
    try {
        console.log("Task ID is of type", typeof taskId);
        await dynamoClient_1.client.send(new lib_dynamodb_1.UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            UpdateExpression: 'SET Tasks.#TaskId.Description = :Description, Tasks.#TaskId.Status = :Status',
            ExpressionAttributeNames: {
                "#TaskId": taskId,
            },
            ExpressionAttributeValues: {
                ":Description": description,
                ":Status": status,
            },
        }));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Task updated successfully" }),
            headers: headers_1.responseHeaders
        };
    }
    catch (error) {
        console.error("Error updating task:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Failed to update task ${taskId}`, error: error.message }),
            headers: headers_1.responseHeaders
        };
    }
};
exports.editTaskHandler = editTaskHandler;
