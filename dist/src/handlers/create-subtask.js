"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubtaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const crypto_1 = __importDefault(require("crypto"));
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const createSubtaskHandler = async (event) => {
    if (event.body && event.requestContext.authorizer && event.pathParameters) {
        const tableName = process.env.PROJECTS_TABLE; // DynamoDB table in SAM template
        const subtask = JSON.parse(event.body);
        const { Subtask: description, Status: status } = subtask;
        const userId = event.requestContext.authorizer.claims.sub; // Get userId from event
        const projectId = event.pathParameters.ProjectId;
        const taskId = event.pathParameters.TaskId;
        const subtaskId = crypto_1.default.randomUUID();
        if (!description || !status) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Subtask description and status are required" }),
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
                ConditionExpression: "attribute_exists(Tasks.#TaskId)",
                UpdateExpression: "SET Tasks.#TaskId.Subtasks.#SubtaskId = :SubtaskData",
                ExpressionAttributeNames: {
                    "#TaskId": taskId,
                    "#SubtaskId": subtaskId,
                },
                ExpressionAttributeValues: {
                    ":SubtaskData": {
                        "Description": description,
                        "Status": status,
                    }
                },
            }));
            return {
                statusCode: 201,
                body: JSON.stringify({ message: "Created subtask" }),
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
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
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            };
        }
    }
    else {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Must provide body, user, and path parameters" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
};
exports.createSubtaskHandler = createSubtaskHandler;
