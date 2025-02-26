import {client} from "../../utils/dynamoClient";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {APIGatewayEvent} from "aws-lambda";

export const deleteTaskHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (event.pathParameters) {
        const userId = event.pathParameters.UserId
        const projectId = event.pathParameters.ProjectId
        const taskId = event.pathParameters.TaskId

        if(!taskId) {
            return JSON.stringify({message: "task not found"})
        }

        try {
            await client.send(new UpdateCommand({
                TableName: tableName,
                Key: {
                    UserId: userId,
                    ProjectId: projectId,
                },
                ConditionExpression: "attribute_exists(Tasks.#TaskId)",
                UpdateExpression: 'REMOVE Tasks.#TaskId',
                ExpressionAttributeNames: {
                    "#TaskId": taskId,
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
