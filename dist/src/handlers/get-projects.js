"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectsHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const headers_1 = require("../../utils/headers");
const getProjectsHandler = async (event) => {
    const table = process.env.PROJECTS_TABLE;
    if (!table) {
        console.warn(`No table name provided`);
        throw new Error("No table name provided");
    }
    // Check for the necessary authorization info
    if (!event.requestContext.authorizer) {
        console.error("missing authorizer event");
        return {
            statusCode: 401,
            body: JSON.stringify({ message: "Unauthorized request" }),
            headers: headers_1.responseHeaders
        };
    }
    try {
        const userId = event.requestContext.authorizer.claims.sub;
        const { Items } = await dynamoClient_1.client.send(new lib_dynamodb_1.QueryCommand({
            TableName: table,
            KeyConditionExpression: "UserId = :UserId",
            ExpressionAttributeValues: {
                ":UserId": userId,
            },
        }));
        if (Items && Items.length > 0) {
            // Projects found, return them
            return {
                statusCode: 200,
                body: JSON.stringify({ projects: Items }),
                headers: headers_1.responseHeaders
            };
        }
        else {
            // No projects found
            console.warn('No projects found for UserId:', userId);
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "No projects found" }),
                headers: headers_1.responseHeaders
            };
        }
    }
    catch (error) {
        console.error('Error occurred while querying DynamoDB:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to retrieve projects", error: error.message }),
            headers: headers_1.responseHeaders
        };
    }
};
exports.getProjectsHandler = getProjectsHandler;
