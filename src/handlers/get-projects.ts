import { client } from "../../utils/dynamoClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";

export const getProjectsHandler = async (event: APIGatewayEvent) => {
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
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    try {
        const userId = event.requestContext.authorizer.claims.sub;

        const { Items } = await client.send(new QueryCommand({
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
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            };
        } else {
            // No projects found
            console.warn('No projects found for UserId:', userId);
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "No projects found" }),
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            };
        }
    } catch (error: any) {
        console.error('Error occurred while querying DynamoDB:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to retrieve projects", error: error.message }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
};
