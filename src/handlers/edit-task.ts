import {client} from "../../utils/dynamoClient";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {APIGatewayEvent} from "aws-lambda";
import {responseHeaders} from "../../utils/headers";

export const editTaskHandler = async (event: APIGatewayEvent) => {
    interface Subtask {
       name: string;
       status: boolean
    }

    interface SubtaskWithId {
        [subtaskId: string]: Subtask;
    }



    // interface SubtaskInterface {
    //     Record<string: Subtask>
    // }

    const tableName = process.env.PROJECTS_TABLE;

    if (!tableName) {
        console.warn(`No table name provided`);
        return {
            statusCode: 500,
            body: JSON.stringify({message: "No table name provided"}),
            headers: responseHeaders
        };
    }

    if (!event.requestContext.authorizer) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Unauthorized"}),
            headers: responseHeaders
        };
    }

    const userId = event.requestContext.authorizer.claims.sub;

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Request body not provided"}),
            headers: responseHeaders
        };
    }

    const taskParameters = JSON.parse(event.body);
    const {
        ProjectId: projectId,
        Phase: phase,
        TaskId: taskId,
        Name: name,
        Description: description,
        SubtasksToUpdate: subtasksToUpdate,
        Subtasks: subtasks

    } = taskParameters;


    if (!taskId) {
        console.log("taskId missing");
        return {
            statusCode: 400,
            body: JSON.stringify({message: "TaskId must be provided"}),
            headers: responseHeaders
        };
    }

    const updateObject = (withId: SubtaskWithId, without: Subtask[]) => {
        without.forEach(subtask => {
           withId[crypto.randomUUID()] = subtask

        })

    }

    updateObject(subtasksToUpdate, subtasks)


    try {
        await client.send(new UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            UpdateExpression: 'SET Phases.#Phase.#TaskId.#Name = :Name, Phases.#Phase.#TaskId.#Description = :Description, Phases.#Phase.#TaskId.subtasks = :Subtasks',
            ExpressionAttributeNames: {
                "#Phase": phase,
                "#TaskId": taskId,
                "#Name": "name",
                "#Description": "description",
            },
            ExpressionAttributeValues: {
                ":Name": name,
                ":Description": description,
                ":Subtasks": subtasksToUpdate,
            },
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({message: "Task updated successfully"}),
            headers: responseHeaders
        };
    } catch (error: any) {
        console.error("Error updating task:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: `Failed to update task ${taskId}`, error: error.message}),
            headers: responseHeaders
        };
    }
};
