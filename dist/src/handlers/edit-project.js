"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProjectHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const editProjectHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (event.body && event.requestContext.authorizer && event.pathParameters) {
        const projectParameters = JSON.parse(event.body);
        const userId = event.requestContext.authorizer.claims.sub;
        const projectId = event.pathParameters.ProjectId;
        const { Project: project } = projectParameters;
        try {
            const data = await dynamoClient_1.client.send(new lib_dynamodb_1.UpdateCommand({
                TableName: tableName,
                Key: {
                    UserId: userId,
                    ProjectId: projectId,
                },
                ConditionExpression: "ProjectId = :ProjectId",
                UpdateExpression: "SET Project = :Project",
                ExpressionAttributeValues: {
                    ":ProjectId": projectId,
                    ":Project": project,
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
                body: JSON.stringify({ error: error.message })
            };
        }
    }
};
exports.editProjectHandler = editProjectHandler;
