import {client} from "../../utils/dynamoClient";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {APIGatewayEvent} from "aws-lambda";
import {responseHeaders} from "../../utils/headers";

export const editSubtaskHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;

    if (!tableName) {
        console.error("No table name provided");
        return {
            statusCode: 500,
            body: JSON.stringify({message: "No table name provided"}),
            headers: responseHeaders
        };
    }

    if (!event.body || !event.requestContext.authorizer || !event.pathParameters) {
        console.error("Function parameters not provided:", event);
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Missing required parameters (body, user, taskId, subtaskId)"}),
            headers: responseHeaders
        };
    }

    const userId = event.requestContext.authorizer.claims.sub;
    const subtaskParameters = JSON.parse(event.body);
    const {Phase: phase, Status: status} = subtaskParameters;
    if (!phase || !status) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Missing Phase or Status in subtask parameters"}),
            headers: responseHeaders
        };
    }
    const projectId = event.pathParameters.ProjectId;
    const taskId = event.pathParameters.TaskId;
    const subtaskId = event.pathParameters.SubtaskId;

    if (!taskId || !subtaskId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "TaskId and SubtaskId must be provided"}),
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
