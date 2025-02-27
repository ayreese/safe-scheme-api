import { client } from "../../utils/dynamoClient";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";

export const deleteProjectHandler = async (event: APIGatewayEvent) => {
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
        await client.send(new DeleteCommand({
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
    } catch (error: any) {
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
