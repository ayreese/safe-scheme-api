import {client} from "../../utils/dynamoClient";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {APIGatewayEvent} from "aws-lambda";

export const editSubtaskHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (event.body && event.pathParameters && event.requestContext.authorizer) {
        const userId = event.requestContext.authorizer.claims.sub;
        const subtaskParameters = JSON.parse(event.body);
        const {Description: description, Status: status} = subtaskParameters;
        const projectId = event.pathParameters.ProjectId;
        const taskId = event.pathParameters.TaskId;
        const subtaskId = event.pathParameters.SubtaskId;

        if (!taskId || !subtaskId) {
            return JSON.stringify({message: "check id's"})
        }

        try {
            const data = await client.send(new UpdateCommand({
                TableName: tableName,
                Key: {
                    UserId: userId,
                    ProjectId: projectId,
                },
                UpdateExpression: 'SET Tasks.#TaskId.Subtasks.#SubtaskId.Description = :Description, Tasks.#TaskId.Subtasks.#SubtaskId.#Status = :Status',
                ExpressionAttributeNames: {
                    "#TaskId": taskId,
                    "#SubtaskId": subtaskId,
                    "#Status": "Status",
                },
                ExpressionAttributeValues: {
                    ":Description": description,
                    ":Status": status
                }
            }))
            return {
                statusCode: 200,
                body: JSON.stringify({data: data})
            }
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({message: `Task ${subtaskId} could not be updated`})
            }

        }
    }

};
