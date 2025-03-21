import { client } from "../../utils/dynamoClient";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";
import {responseHeaders} from "../../utils/headers";

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
            headers: responseHeaders
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
            headers: responseHeaders
        };
    } catch (error: any) {
        console.error("Error deleting project:", { userId, projectId, error: error.message });
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to delete project",
                error: error.message,
            }),
            headers: responseHeaders
        };
    }
};
