import {client} from "../../utils/dynamoClient.mjs";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
// import {tasksHelper} from "../../functions/tasks-helper.mjs";

export const editTaskHandler = async (event) => {
    const task = JSON.parse(event.body);
    console.log("THIS IS THE TASK", task);
    const {taskId, name, status} = task;
    const tableName = process.env.PROJECTS_TABLE;
    const projectId = event.pathParameters.ProjectId;
    // const taskId = event.pathParameters.ProjectId;

    try {
        const data = await client.send(new UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: "e1df74f8610de4bd",
                ProjectId: projectId,
            },
            ConditionExpression: "taskId = :taskId",
            UpdateExpression: "SET name = :name, status = :status",
            ExpressionAttributeValues: {
                ":taskId": taskId,
                ":name": name,
                ":status": status,

            }
        }))
        return {
            statusCode: 200,
            body: JSON.stringify({data: data})
        }
    } catch (error) {
        console.error(error);
    }
};
