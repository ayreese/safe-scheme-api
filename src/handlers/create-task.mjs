import {client} from "../../utils/dynamoClient.mjs";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {randomUUID} from 'crypto';

export const createTaskHandler = async (event) => {
    const taskProperties = JSON.parse(event.body);
    const tableName = process.env.PROJECTS_TABLE;
    const projectId = event.pathParameters.ProjectId;
    const {TaskDescription} = taskProperties;
    const userId = event.requestContext.authorizer.claims.sub; // Get userId from event provided by cognito
    const taskId = randomUUID()

    try {
        const data = await client.send(new UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            ConditionExpression: "ProjectId = :projectId",
            UpdateExpression: "SET #tasksMap.#taskId = :taskData",
            ExpressionAttributeNames: {
                "#tasksMap": "Tasks",
                "#taskId": taskId,
            },
            ExpressionAttributeValues: {
                ":taskData": {
                    "Description": TaskDescription,
                    "Status": false,
                    "Subtasks": {}
                },
                ":projectId": projectId,
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
