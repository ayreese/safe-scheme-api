"use strict";
// Function to update the task phase
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const headers_1 = require("../../utils/headers");
const updateTaskHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.warn(`No table name provided`);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "No table name provided" }),
            headers: headers_1.responseHeaders
        };
    }
    if (!event.body || !event.requestContext.authorizer) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing required parameters (body, user, taskId)" }),
            headers: headers_1.responseHeaders
        };
    }
    const userId = event.requestContext.authorizer.claims.sub;
    const taskParameters = JSON.parse(event.body);
    const { ProjectId: projectId, PrevPhase: prevPhase, NextPhase: phase, TaskId: taskId } = taskParameters;
    // Ensure all required parameters are provided
    if (!taskId || !projectId || !prevPhase || !phase) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing required parameters (taskId, projectId, prevPhase, newPhase)" }),
            headers: headers_1.responseHeaders
        };
    }
    try {
        // Retrieve the task from DynamoDB
        const taskToUpdate = await dynamoClient_1.client.send(new lib_dynamodb_1.GetCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId
            },
            ExpressionAttributeNames: {
                "#PrevPhase": prevPhase,
                "#TaskId": taskId
            },
            ProjectionExpression: "Phases.#PrevPhase.#TaskId"
        }));
        // Check if task exists in the previous phase
        if (taskToUpdate.Item?.Phases?.[prevPhase]?.[taskId]) {
            const item = taskToUpdate.Item.Phases[prevPhase][taskId];
            item.phase = phase;
            const task = { [taskId]: item };
            // Move the task to the new phase
            await dynamoClient_1.client.send(new lib_dynamodb_1.UpdateCommand({
                TableName: tableName,
                Key: {
                    UserId: userId,
                    ProjectId: projectId,
                },
                UpdateExpression: 'SET Phases.#Phase = :Task REMOVE Phases.#PrevPhase.#TaskId',
                ExpressionAttributeNames: {
                    "#Phase": phase,
                    "#PrevPhase": prevPhase,
                    "#TaskId": taskId
                },
                ExpressionAttributeValues: {
                    ":Task": task,
                },
            }));
            console.log(`Task moved to phase ${phase}:`, task);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Task updated successfully" }),
                headers: headers_1.responseHeaders
            };
        }
        else {
            console.log(`Task with taskId ${taskId} not found`);
            return {
                statusCode: 404,
                body: JSON.stringify({ message: `Task with taskId ${taskId} not found` }),
                headers: headers_1.responseHeaders
            };
        }
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
exports.updateTaskHandler = updateTaskHandler;
