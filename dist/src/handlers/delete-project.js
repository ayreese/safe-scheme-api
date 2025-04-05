"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProjectHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const headers_1 = require("../../utils/headers");
const deleteProjectHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        throw new Error("No table name provided");
    }
    if (!event.requestContext.authorizer) {
        console.info("Unauthorized user: missing or invalid token");
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Unauthorized user",
            }),
            headers: headers_1.responseHeaders
        };
    }
    const userId = event.requestContext.authorizer.claims.sub;
    if (!event.body) {
        console.info("Unauthorized user: missing or invalid token");
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Unauthorized user",
            }),
            headers: headers_1.responseHeaders
        };
    }
    const projectToDelete = JSON.parse(event.body);
    const { ProjectId: projectId } = projectToDelete;
    try {
        await dynamoClient_1.client.send(new lib_dynamodb_1.DeleteCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
        }));
        return {
            statusCode: 204,
            headers: headers_1.responseHeaders
        };
    }
    catch (error) {
        console.error("Error deleting project:", { userId, projectId, error: error.message });
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to delete project",
                error: error.message,
            }),
            headers: headers_1.responseHeaders
        };
    }
};
exports.deleteProjectHandler = deleteProjectHandler;
