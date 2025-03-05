import { client } from "../../utils/dynamoClient";
import {QueryCommand, QueryCommandOutput} from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";
import {responseHeaders} from "../../utils/headers";

export const getProjectsHandler = async (event: APIGatewayEvent) => {
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
            headers: responseHeaders
        };
    }

    try {
        const userId = event.requestContext.authorizer.claims.sub;
        const data: QueryCommandOutput = await client.send(new QueryCommand({
            TableName: table,
            KeyConditionExpression: "UserId = :UserId",
            ExpressionAttributeValues: {
                ":UserId": userId,
            },
        }));
        const statusCode = data.$metadata.httpStatusCode
        const items = data.Items

        return {
            statusCode: statusCode,
            body: JSON.stringify({message: `Number of projects found ${items?.length}`, projects: items }),
            headers: responseHeaders
        };
    } catch (error: any) {
        console.error('Error occurred while querying DynamoDB:', error.message, error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to retrieve projects due to a server error", error: error.message }),
            headers: responseHeaders
        };
    }
};
