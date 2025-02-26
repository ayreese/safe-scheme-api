"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const createTaskHandler = async (event) => {
    if (event.body && event.requestContext.authorizer && event.pathParameters) {
        const taskProperties = JSON.parse(event.body);
        const tableName = process.env.PROJECTS_TABLE;
        const projectId = event.pathParameters.ProjectId;
        const { TaskDescription } = taskProperties;
        const userId = event.requestContext.authorizer.claims.sub; // Get userId from event provided by cognito
        const taskId = crypto.randomUUID();
        try {
            const data = await dynamoClient_1.client.send(new lib_dynamodb_1.UpdateCommand({
                TableName: tableName,
                Key: {
                    UserId: userId,
                    ProjectId: projectId,
                },
                ConditionExpression: "ProjectId = :ProjectId",
                UpdateExpression: "SET Tasks.#TaskId = :TaskData",
                ExpressionAttributeNames: {
                    "#TaskId": taskId,
                },
                ExpressionAttributeValues: {
                    ":TaskData": {
                        "Description": TaskDescription,
                        "Status": false,
                        "Subtasks": {}
                    },
                    ":ProjectId": projectId,
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
                body: JSON.stringify({ message: "Failed to create task", error: error.message })
            };
        }
    }
    else {
        throw new Error("Body must be provided");
    }
};
exports.createTaskHandler = createTaskHandler;
