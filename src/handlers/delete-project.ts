import { client } from "../../utils/dynamoClient";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";
import {responseHeaders} from "../../utils/headers";

export const deleteProjectHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;

    if (!tableName) {
        throw new Error("No table name provided");
    }

    if (!event.requestContext.authorizer) {
        console.info("Unauthorized user: missing or invalid token");
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Unauthorized user",
            }),
            headers: responseHeaders
        };
    }

    const userId = event.requestContext.authorizer.claims.sub;
    if (!event.body) {
        console.info("Unauthorized user: missing or invalid token");
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Unauthorized user",
            }),
            headers: responseHeaders
        };
    }
    const projectToDelete = JSON.parse(event.body);
    const { ProjectId: projectId } = projectToDelete
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
