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
        const userId = event.requestContext.authorizer.claims.sub; // Get userId from event provided by cognito
        const projectId = event.pathParameters.ProjectId;
        const taskId = event.pathParameters.TaskId || "";
        const subtaskId = crypto_1.default.randomUUID();
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
                body: JSON.stringify({ message: "Created subtask" })
            };
        }
        catch (e) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Failed to create subtask", error: e.message })
            };
        }
    }
    else {
        throw new Error("Must provide body, user, and path parameters");
    }
};
exports.createSubtaskHandler = createSubtaskHandler;
