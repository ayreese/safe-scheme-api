"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProjectHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const headers_1 = require("../../utils/headers");
const editProjectHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "No table name provided" }),
            headers: headers_1.responseHeaders
        };
    }
    if (!event.body || !event.requestContext.authorizer || !event.pathParameters || !event.pathParameters.ProjectId) {
        console.log("Function event:", event);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing required parameters (body, user, projectId)" }),
            headers: headers_1.responseHeaders
        };
    }
    const projectParameters = JSON.parse(event.body);
    const userId = event.requestContext.authorizer.claims.sub;
    const projectId = event.pathParameters.ProjectId;
    const { Project: project } = projectParameters;
    try {
        await dynamoClient_1.client.send(new lib_dynamodb_1.UpdateCommand({
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
            },
        }));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Project updated successfully" }),
            headers: headers_1.responseHeaders
        };
    }
    catch (error) {
        console.error("Error updating project:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to update project", error: error.message }),
            headers: headers_1.responseHeaders
        };
    }
};
exports.editProjectHandler = editProjectHandler;
