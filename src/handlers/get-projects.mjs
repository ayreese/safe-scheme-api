import {ddbDocClient} from "../../utils/dynamoClient.mjs";
import {validateBody} from "../../functions/validate.mjs";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";

// Function to get user from table
export const getProjectsHandler = async (event) => {
    const parseBody = validateBody(event.body);
    const {id} = parseBody;
    const table = process.env.PROJECT_TABLES;
    // Get user from table by ID
    const params = {
        TableName: table,
        KeyConditionExpression: "UserId = :id", // Correct KeyConditionExpression
        ExpressionAttributeValues: {
            "project-id": id
        }
    };

    try {
        // Query DynamoDB for user data
        const {items: Items} = await ddbDocClient.send(new QueryCommand(params));

        // Switch based on Items
        switch (true) {
            case (Items && Items.length > 0):
                console.info('Found projects:', Items);
                return {
                    statusCode: 200,
                    body: JSON.stringify({projects: Items})
                };

            case (Items && Items.length === 0):
                console.warn('No projects found for user ID:', id);
                return {
                    statusCode: 404,
                    body: JSON.stringify({message: "Not Found"})
                };

            default:
                console.error('Unexpected error or condition occurred');
                return {
                    statusCode: 500,
                    body: JSON.stringify({message: "Something went wrong."})
                };
        }
    } catch (error) {
        // Log error and return the error response
        console.error('Error occurred while querying DynamoDB:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Bad Request", error: error.message})
        };
    }
};
