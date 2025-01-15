import {client} from "../../utils/dynamoClient.mjs";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
// import {tasksHelper} from "../../functions/tasks-helper.mjs";

export const editTaskHandler = async (event) => {
    const taskParameters = JSON.parse(event.body);
    const {Description: description, Status: status} = taskParameters;
    const tableName = process.env.PROJECTS_TABLE;
    const projectId = event.pathParameters.ProjectId;
    const taskId = event.pathParameters.TaskId;
    const userId = event.requestContext.authorizer.claims.sub;

    try {
        console.log("Task ID is of type", typeof taskId)
        const data = await client.send(new UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            UpdateExpression: 'SET Tasks.#TaskId.Description = :Description, Tasks.#TaskId.#Status = :Status',
            ExpressionAttributeNames: {
                "#TaskId": taskId,
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
            body: JSON.stringify({message: `Task ${taskId} could not be updated`})
        }

    }
};
