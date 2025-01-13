import {client} from "../../utils/dynamoClient.mjs";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
// import {tasksHelper} from "../../functions/tasks-helper.mjs";

export const editTaskHandler = async (event) => {
    const taskParameters = JSON.parse(event.body);
    console.log("THIS IS THE TASK", taskParameters);
    const {Task: task, Status: status} = taskParameters;
    const tableName = process.env.PROJECTS_TABLE;
    const projectId = event.pathParameters.ProjectId;
    const taskId = event.pathParameters.TaskId;

    try {
        const data = await client.send(new UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: "3aa2a3ab-3e4c-4c11-a774-82fa1f27bb6a",
                ProjectId: projectId,
            },
            ConditionExpression: 'attribute_exists(Task) AND TaskID = :taskId',
            UpdateExpression: 'SET #status = :status, Task = :task',
            ExpressionAttributeNames: {
                '#status': 'Status'  // Use a placeholder for the reserved word
            },
            ExpressionAttributeValues: {
                ':taskId': taskId,
                ':task': task,
                ':status': status
            }
            // ConditionExpression: "TaskId = :taskId",
            // UpdateExpression: "SET Task = :task, Status = :status",
            // ExpressionAttributeValues: {
            //     ":taskId": taskId,
            //     ":task": task,
            //     ":status": status,
            //
            // }
        }))
        return {
            statusCode: 200,
            body: JSON.stringify({data: data})
        }
    } catch (error) {
        console.error(error);
    }
};
