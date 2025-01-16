import {client} from "../../utils/dynamoClient.mjs";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";

export const deleteSubtaskHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    const userId = event.pathParameters.UserId
    const projectId = event.pathParameters.ProjectId
    const taskId = event.pathParameters.TaskId
    const subtaskId = event.pathParameters.SubtaskId


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
};
