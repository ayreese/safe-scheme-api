"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProjectHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const deleteProjectHandler = async (event) => {
    if (event.pathParameters) {
        const tableName = process.env.PROJECTS_TABLE;
        const userId = event.pathParameters.UserId;
        const projectId = event.pathParameters.ProjectId;
        try {
            await dynamoClient_1.client.send(new lib_dynamodb_1.DeleteCommand({
                TableName: tableName,
                Key: {
                    UserId: userId,
                    ProjectId: projectId,
                },
                ConditionExpression: "ProjectId = :ProjectId",
                ExpressionAttributeValues: {
                    ":ProjectId": projectId,
                }
            }));
            return {
                statusCode: 204,
            };
        }
        catch (error) {
            return {
                statusCode: 404,
            };
        }
    }
    else {
        throw new Error("Unable to delete project");
    }
};
exports.deleteProjectHandler = deleteProjectHandler;
