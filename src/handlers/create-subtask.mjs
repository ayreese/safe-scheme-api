/*
To create a userID to test function use:
const userId = crypto.randomBytes(8).toString('hex');
*/

import {client} from "../../utils/dynamoClient.mjs";
import crypto from 'crypto';
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";

export const createSubtaskHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE; // DynamoDB table in SAM template
    const subtask = JSON.parse(event.body);
    const {Subtask: description, Status: status} = subtask;
    const userId = event.requestContext.authorizer.claims.sub; // Get userId from event provided by cognito
    const projectId = event.pathParameters.ProjectId;
    const taskId = event.pathParameters.TaskId;
    const subtaskId = crypto.randomUUID()

    try {
        await client.send(new UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            ConditionExpression: "attribute_exists(Tasks.#TaskId)",
            UpdateExpression: "SET Tasks.#TaskId.Subtasks.#SubtaskId = :subtaskData",
            ExpressionAttributeNames: {
                "#TaskId": taskId,
                "#SubtaskId": subtaskId,
            },
            ExpressionAttributeValues: {
                ":subtaskData": {
                    "Description": description,
                    ":Status": status,
                }
            },
        }));
        return {
            statusCode: 201,
            body: JSON.stringify({message: "Created subtask"})
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Failed to create subtask", error: e.message})
        };
    }
};
