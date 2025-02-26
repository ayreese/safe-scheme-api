"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const editTaskHandler = async (event) => {
    if (event.body && event.pathParameters && event.requestContext.authorizer) {
        const taskParameters = JSON.parse(event.body);
        const { Description: description, Status: status } = taskParameters;
        const tableName = process.env.PROJECTS_TABLE;
        const projectId = event.pathParameters.ProjectId;
        const taskId = event.pathParameters.TaskId;
        const userId = event.requestContext.authorizer.claims.sub;
        if (!taskId) {
            return JSON.stringify({ message: "Task not found", statusCode: 400 });
        }
        try {
            console.log("Task ID is of type", typeof taskId);
            const data = await dynamoClient_1.client.send(new lib_dynamodb_1.UpdateCommand({
                TableName: tableName,
                Key: {
                    UserId: userId,
                    ProjectId: projectId,
                },
                UpdateExpression: 'SET Tasks.#TaskId.Description = :Description, Tasks.#TaskId.#Status = :Status',
                ExpressionAttributeNames: {
                    "#TaskId": taskId,
                    "#Status": "Status",
                },
                ExpressionAttributeValues: {
                    ":Description": description,
                    ":Status": status
                }
            }));
            return {
                statusCode: 200,
                body: JSON.stringify({ data: data })
            };
        }
        catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Task ${taskId} could not be updated` })
            };
        }
    }
};
exports.editTaskHandler = editTaskHandler;
