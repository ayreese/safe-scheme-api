"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectsHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const getProjectsHandler = async (event) => {
    const table = process.env.PROJECTS_TABLE;
    if (event.requestContext.authorizer) {
        try {
            const userId = event.requestContext.authorizer.claims.sub;
            const { Items } = await dynamoClient_1.client.send(new lib_dynamodb_1.QueryCommand({
                TableName: table,
                KeyConditionExpression: "UserId = :UserId",
                ExpressionAttributeValues: {
                    ":UserId": userId,
                },
            }));
            // Switch based on Items
            switch (true) {
                // Found items and return to user
                case (Items && Items.length > 0):
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ projects: Items }),
                    };
                // No items found, returns 404 not found
                case (Items && Items.length === 0):
                    console.warn('No projects found for UserId:', userId);
                    return {
                        statusCode: 404,
                        body: JSON.stringify({ message: "Not Found" }),
                    };
                // Default statement for all other errors
                default:
                    console.error('Unexpected error or condition occurred');
                    return {
                        statusCode: 500,
                        body: JSON.stringify({ message: "Something went wrong." }),
                    };
            }
        }
        catch (error) {
            console.error('Error occurred while querying DynamoDB:', error.message);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Bad Request", error: error.message }),
            };
        }
    }
};
exports.getProjectsHandler = getProjectsHandler;
