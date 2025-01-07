import {client} from "../../utils/dynamoClient.mjs";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";

// Function to get projects from table based on UserId
export const getProjectsHandler = async (event) => {
    /* Testing UserID */
    const userId = event.pathParameters.UserId;
    /* Production UserID */
    // const userId = event.requestContext.authorizer.principalId;


    const table = process.env.PROJECTS_TABLE;  // Get table name from environment variables

    try {
        // Query DynamoDB for user data
        const {Items} = await client.send(new QueryCommand({
            TableName: table,
            KeyConditionExpression: "UserId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId,
            },
        }));
        console.log("ALL TABLE ITEMS",Items);

        // Switch based on Items
        switch (true) {
            case (Items && Items.length > 0):
                console.info('Found projects:', Items);
                return {
                    statusCode: 200,
                    body: JSON.stringify({projects: Items}),
                };

            case (Items && Items.length === 0):
                console.warn('No projects found for UserId:', userId);
                return {
                    statusCode: 404,
                    body: JSON.stringify({message: "Not Found"}),
                };

            default:
                console.error('Unexpected error or condition occurred');
                return {
                    statusCode: 500,
                    body: JSON.stringify({message: "Something went wrong."}),
                };
        }
    } catch (error) {
        // Log error and return the error response
        console.error('Error occurred while querying DynamoDB:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Bad Request", error: error.message}),
        };
    }
};
