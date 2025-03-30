import {client} from "../../utils/dynamoClient";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {APIGatewayEvent} from "aws-lambda";
import {responseHeaders} from "../../utils/headers";

export const editSubtaskHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.warn(`Environment variable PROJECT_TABLE is missing, cannot query DynamoDB`);
        throw new Error("Database error");
    }

    if (!event.requestContext.authorizer) {
        console.error("missing authorizer event, unable to get user");
        console.log("Event received", event);
        return {
            statusCode: 401,
            body: JSON.stringify({message: "request missing user, token not read"}),
            headers: responseHeaders
        };
    }
    const userId = event.requestContext.authorizer.claims.sub;
    if (!userId) {
        console.error("Unable to get user");
        console.log("Event received", event);
        return {
            statusCode: 401,
            body: JSON.stringify({message: "request missing user, token not read"}),
            headers: responseHeaders
        };
    }

    if (!event.body) {
        console.log("Event body:", event.body);
        return {
            statusCode: 400,
            body: JSON.stringify({message: `Missing body: ${event.body}`}),
            headers: responseHeaders
        };
    }

    const subtaskParameters = JSON.parse(event.body);
    const {
        ProjectId: projectId,
        Phase: phase,
        TaskId: taskId,
        SubtaskId: subtaskId,
        Status: status
    } = subtaskParameters;

    if (!phase) {
        console.error("Event received", event.body);
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Missing Phase parameters"}),
            headers: responseHeaders
        };
    }

    if (typeof status !== "boolean") {
        console.error("Event received", event.body);
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Missing Status parameters"}),
            headers: responseHeaders
        };
    }


    if (!taskId) {
        console.error("Event received", event.body);
        return {
            statusCode: 400,
            body: JSON.stringify({message: "TaskId must be provided"}),
            headers: responseHeaders
        };
    }

    if (!subtaskId) {
        console.error("Event received", event.body);
        return {
            statusCode: 400,
            body: JSON.stringify({message: "SubtaskId must be provided"}),
            headers: responseHeaders
        };
    }

    try {
        const response = await client.send(new UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            UpdateExpression: 'SET Phases.#Phase.#TaskId.subtasks.#SubtaskId.#Status = :Status',
            ExpressionAttributeNames: {
                "#Phase": phase,
                "#TaskId": taskId,
                "#SubtaskId": subtaskId,
                "#Status": "status"
            },
            ExpressionAttributeValues: {
                ":Status": status

            },
        }));
        console.log("DynamoDB Response", response);

        return {
            statusCode: 200,
            body: JSON.stringify({message: "Subtask updated successfully"}),
            headers: responseHeaders
        };
    } catch (error: any) {
        console.error("Error updating subtask:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: `Failed to update subtask ${subtaskId}`, error: error.message}),
            headers: responseHeaders
        };
    }
};
