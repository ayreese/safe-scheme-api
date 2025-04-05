import { client } from "../../utils/dynamoClient";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";
import {responseHeaders} from "../../utils/headers";

export const deleteTaskHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.error("No table name provided");
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "No table name provided" }),
            headers: responseHeaders
        };
    }
    if (!event.requestContext.authorizer) {
        console.log("parameters:", event.pathParameters);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid permissions or token" }),
            headers: responseHeaders
        };
    }
    const userId = event.requestContext.authorizer.claims.sub;

    if ( !event.body) {
        console.log("parameters:", event.pathParameters);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "UserId, ProjectId, and TaskId must be provided." }),
            headers: responseHeaders
        };
    }
    const taskToDelete = JSON.parse(event.body);
    const {ProjectId: projectId, Phase: phase, TaskId: taskId} = taskToDelete;


    if (!taskId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "task not found" }),
            headers: responseHeaders
        };
    }


    try {
        await client.send(new UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            ConditionExpression: "attribute_exists(Phases.#Phase.#TaskId)",
            UpdateExpression: 'REMOVE Phases.#Phase.#TaskId',
            ExpressionAttributeNames: {
                "#Phase": phase,
                "#TaskId": taskId,
            },
        }));

        return {
            statusCode: 204,
            headers: responseHeaders
        };
    } catch (error: any) {
        console.error("Error deleting task:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to delete task", error: error.message }),
            headers: responseHeaders
        };
    }
};
