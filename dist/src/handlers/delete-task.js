"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const deleteTaskHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (event.pathParameters) {
        const userId = event.pathParameters.UserId;
        const projectId = event.pathParameters.ProjectId;
        const taskId = event.pathParameters.TaskId;
        if (!taskId) {
            return JSON.stringify({ message: "task not found" });
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
                statusCode: 204
            };
        }
        catch (error) {
            return {
                statusCode: 404
            };
        }
    }
};
exports.deleteTaskHandler = deleteTaskHandler;
