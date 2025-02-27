"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProjectHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const deleteProjectHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        throw new Error("No table name provided");
    }
    if (!event.pathParameters || !event.pathParameters.ProjectId || !event.pathParameters.UserId) {
        console.info("Missing path parameters:", event.pathParameters);
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "UserId and ProjectId must be provided.",
            }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
    const userId = event.pathParameters.UserId;
    const projectId = event.pathParameters.ProjectId;
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
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
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
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
};
exports.deleteProjectHandler = deleteProjectHandler;
