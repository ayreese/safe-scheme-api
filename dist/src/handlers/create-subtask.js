"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubtaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const crypto_1 = __importDefault(require("crypto"));
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const headers_1 = require("../../utils/headers");
const createSubtaskHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE; // DynamoDB table in SAM template
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Body is required" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
    if (!event.requestContext.authorizer) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Token is required" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
    const userId = event.requestContext.authorizer.claims.sub; // Get userId from event
    const subtask = JSON.parse(event.body);
    const { ProjectId: projectId, TaskId: taskId, Phase: phase, Name: name } = subtask;
    const subtaskId = crypto_1.default.randomUUID();
    if (!name) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Subtask name is required" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
    if (!projectId || !taskId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "ProjectId and TaskId are required" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
    try {
        await dynamoClient_1.client.send(new lib_dynamodb_1.UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            UpdateExpression: "SET Phases.#Phase.#TaskId.subtasks.#SubtaskId = :SubtaskData",
            ExpressionAttributeNames: {
                "#Phase": phase,
                "#TaskId": taskId,
                "#SubtaskId": subtaskId,
            },
            ExpressionAttributeValues: {
                ":SubtaskData": {
                    "name": name,
                    "status": false,
                }
            },
        }));
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Created subtask" }),
            headers: headers_1.responseHeaders
        };
    }
    catch (e) {
        console.error("Error updating subtask:", {
            userId,
            projectId,
            taskId,
            subtaskId,
            error: e.message
        });
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to create subtask",
                error: e.message,
            }),
            headers: headers_1.responseHeaders
        };
    }
};
exports.createSubtaskHandler = createSubtaskHandler;
