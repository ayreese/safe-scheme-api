"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubtaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const deleteSubtaskHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (event.requestContext.authorizer && event.pathParameters && tableName) {
        const userId = event.requestContext.authorizer.claims.sub;
        const projectId = event.pathParameters.ProjectId;
        const taskId = event.pathParameters.TaskId;
        const subtaskId = event.pathParameters.SubtaskId;
        if (!userId || !projectId || !taskId || !subtaskId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing required parameters." })
            };
        }
        try {
            await dynamoClient_1.client.send(new lib_dynamodb_1.UpdateCommand({
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
exports.deleteSubtaskHandler = deleteSubtaskHandler;
