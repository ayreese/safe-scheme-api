"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectsHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const headers_1 = require("../../utils/headers");
const getProjectsHandler = async (event) => {
    const table = process.env.PROJECTS_TABLE;
    if (!table) {
        console.warn(`Environment variable PROJECT_TABLE is missing, cannot query DynamoDB`);
        throw new Error("Database error");
    }
    // Check for the necessary authorization info
    if (!event.requestContext.authorizer || !event.requestContext.authorizer.claims.sub) {
        console.error("missing authorizer event, unable to get user");
        return {
            statusCode: 401,
            body: JSON.stringify({ message: "request missing user, token not read" }),
            headers: headers_1.responseHeaders
        };
    }
    try {
        const userId = event.requestContext.authorizer.claims.sub;
        const data = await dynamoClient_1.client.send(new lib_dynamodb_1.QueryCommand({
            TableName: table,
            KeyConditionExpression: "UserId = :UserId",
            ExpressionAttributeValues: {
                ":UserId": userId,
            },
        }));
        const statusCode = data.$metadata.httpStatusCode;
        const items = data.Items;
        return {
            statusCode: statusCode,
            body: JSON.stringify({ message: `Number of projects found ${items?.length}`, projects: items }),
            headers: headers_1.responseHeaders
        };
    }
    catch (error) {
        console.error('Error occurred while querying DynamoDB:', error.message, error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to retrieve projects due to a server error", error: error.message }),
            headers: headers_1.responseHeaders
        };
    }
};
exports.getProjectsHandler = getProjectsHandler;
