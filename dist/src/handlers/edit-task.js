"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const headers_1 = require("../../utils/headers");
const editTaskHandler = async (event) => {
    // interface SubtaskInterface {
    //     Record<string: Subtask>
    // }
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.warn(`No table name provided`);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "No table name provided" }),
            headers: headers_1.responseHeaders
        };
    }
    if (!event.requestContext.authorizer) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Unauthorized" }),
            headers: headers_1.responseHeaders
        };
    }
    const userId = event.requestContext.authorizer.claims.sub;
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Request body not provided" }),
            headers: headers_1.responseHeaders
        };
    }
    const taskParameters = JSON.parse(event.body);
    const { ProjectId: projectId, Phase: phase, TaskId: taskId, Name: name, Description: description, Status: status, SubtasksToUpdate: subtasksToUpdate, Subtasks: subtasks } = taskParameters;
    if (!taskId) {
        console.log("taskId missing");
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "TaskId must be provided" }),
            headers: headers_1.responseHeaders
        };
    }
    const updateObject = (withId, without) => {
        without.forEach(subtask => {
            withId[crypto.randomUUID()] = subtask;
        });
    };
    updateObject(subtasksToUpdate, subtasks);
    try {
        await dynamoClient_1.client.send(new lib_dynamodb_1.UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            UpdateExpression: 'SET Phases.#Phase.#TaskId.#Name = :Name, Phases.#Phase.#TaskId.#Description = :Description, Phases.#Phase.#TaskId.#Status = :Status, Phases.#Phase.#TaskId.subtasks = :Subtasks',
            ExpressionAttributeNames: {
                "#Phase": phase,
                "#TaskId": taskId,
                "#Name": "name",
                "#Description": "description",
                "#Status": "status",
            },
            ExpressionAttributeValues: {
                ":Name": name,
                ":Description": description,
                ":Status": status,
                ":Subtasks": subtasksToUpdate,
            },
        }));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Task updated successfully" }),
            headers: headers_1.responseHeaders
        };
    }
    catch (error) {
        console.error("Error updating task:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Failed to update task ${taskId}`, error: error.message }),
            headers: headers_1.responseHeaders
        };
    }
};
exports.editTaskHandler = editTaskHandler;
