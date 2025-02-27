"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const crypto_1 = __importDefault(require("crypto"));
const createTaskHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.warn("No table name set in environment variables");
        throw new Error("PROJECTS_TABLE is not set in environment variables");
    }
    if (!event.body || !event.requestContext.authorizer || !event.pathParameters) {
        console.info("Missing required parameters:", {
            body: event.body,
            context: event.requestContext,
            path: event.pathParameters,
        });
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Body and authorization are required" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
    const taskProperties = JSON.parse(event.body);
    const projectId = event.pathParameters.ProjectId;
    const { TaskDescription } = taskProperties;
    const userId = event.requestContext.authorizer.claims.sub; // Get userId from event provided by cognito
    const taskId = crypto_1.default.randomUUID();
    // Validate TaskDescription
    if (!TaskDescription) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "TaskDescription is required" }),
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
            UpdateExpression: "SET Tasks.#TaskId = :TaskData",
            ExpressionAttributeNames: {
                "#TaskId": taskId,
            },
            ExpressionAttributeValues: {
                ":TaskData": {
                    "Description": TaskDescription,
                    "Status": false,
                    "Subtasks": {},
                },
            },
        }));
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Created task" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
    catch (error) {
        console.error("Error creating task:", {
            userId,
            projectId,
            taskId,
            error: error.message,
        });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to create task", error: error.message }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
};
exports.createTaskHandler = createTaskHandler;
