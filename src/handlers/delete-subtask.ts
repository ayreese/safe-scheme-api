import {client} from "../../utils/dynamoClient";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {APIGatewayEvent} from "aws-lambda";

export const deleteSubtaskHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (event.requestContext.authorizer && event.pathParameters && tableName) {
        const userId = event.requestContext.authorizer.claims.sub;
        const projectId = event.pathParameters.ProjectId;
        const taskId = event.pathParameters.TaskId;
        const subtaskId = event.pathParameters.SubtaskId;

        if (!userId || !projectId || !taskId || !subtaskId) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: "Missing required parameters."})
            };
        }

        try {
            await client.send(new UpdateCommand({
                TableName: tableName,
                Key: {
                    UserId: userId,
                    ProjectId: projectId,
                },
                ConditionExpression: "attribute_exists(Tasks.#TaskId.Subtasks.#SubtaskId)",
                UpdateExpression: 'REMOVE Tasks.#TaskId.Subtasks.#SubtaskId',
                ExpressionAttributeNames: {
                    "#TaskId": taskId,
                    "#SubtaskId": subtaskId,
                },
            }))
            return {
                statusCode: 204
            };
        } catch (error) {
            return {
                statusCode: 404
            }
        }
    }
};
