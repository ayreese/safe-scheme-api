import { ddbDocClient } from "../../utils/dynamoClient.mjs";
import { validateBody } from "../../functions/validate.mjs";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

// Function to get projects from table based on user-id
export const getProjectsHandler = async (event) => {
    await validateBody(event);

    // Ensure correct key extraction from the event object
    const { 'user-id': userId } = event;  // Correctly extracting user-id

    const table = process.env.PROJECTS_TABLE;  // Get table name from environment variables
    // Get projects from table by user-id
    const params = {
        TableName: table,  // Use the correct table name
        KeyConditionExpression: "#userId = :id",  // Use placeholder for attribute name
        ExpressionAttributeNames: {
            "#userId": "user-id",  // Map placeholder to actual attribute name
        },
        ExpressionAttributeValues: {
            ":id": userId,  // Binding the actual user ID
        },
    };

    try {
        // Query DynamoDB for user data
        const { Items } = await ddbDocClient.send(new QueryCommand(params));

        // Switch based on Items
        switch (true) {
            case (Items && Items.length > 0):
                console.info('Found projects:', Items);
                return {
                    statusCode: 200,
                    body: JSON.stringify({ projects: Items }),
                };

            case (Items && Items.length === 0):
                console.warn('No projects found for user ID:', userId);
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: "Not Found" }),
                };

            default:
                console.error('Unexpected error or condition occurred');
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: "Something went wrong." }),
                };
        }
    } catch (error) {
        // Log error and return the error response
        console.error('Error occurred while querying DynamoDB:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Bad Request", error: error.message }),
        };
    }
};
