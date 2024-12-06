// Create a DocumentClient that represents the query to add an item
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, QueryCommand} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const projectTable = process.env.PROJECTS_TABLE;

// Function to get user from table
export const getProjectsHandler = async (event) => {
    // Check if the event body is null or empty
    if (event.body === null || event.body === "") {
        console.error("Invalid event body:", event.body);
        throw new Error(`${event.body} is not applicable`);
    }

    const id = event.body;

    // Log the received event
    console.info('Received event:', event);

    // Get user from table by ID
    const params = {
        TableName: projectTable,
        KeyConditionExpression: "UserId = :id", // Correct KeyConditionExpression
        ExpressionAttributeValues: {
            ":id": id
        }
    };

    let Items;
    try {
        // Query DynamoDB for user data
        const {Items: result} = await ddbDocClient.send(new QueryCommand(params));
        Items = result;

        // Log the retrieved items
        console.info('Retrieved items:', Items);

        // Switch based on the length of Items
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
