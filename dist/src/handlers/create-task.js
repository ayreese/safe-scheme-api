"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskHandler = void 0;
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const crypto_1 = __importDefault(require("crypto"));
const headers_1 = require("../../utils/headers");
const createTaskHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.warn("No table name set in environment variables");
        throw new Error("PROJECTS_TABLE is not set in environment variables");
    }
    if (!event.body || !event.requestContext.authorizer) {
        console.info("Missing required parameters:", {
            body: event.body,
            context: event.requestContext,
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
    const task = JSON.parse(event.body);
    const { ProjectId: projectId, Phase: phase, Name: name, Description: description } = task;
    const userId = event.requestContext.authorizer.claims.sub; // Get userId from event provided by cognito
    if (!name) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "description is required" }),
            headers: headers_1.responseHeaders
        };
    }
    try {
        const taskId = crypto_1.default.randomUUID();
        await dynamoClient_1.client.send(new lib_dynamodb_1.UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            UpdateExpression: "SET Phases.#Phase.#TaskId = :TaskData",
            ExpressionAttributeNames: {
                "#Phase": phase,
                "#TaskId": taskId,
            },
            ExpressionAttributeValues: {
                ":TaskData": {
                    "name": name,
                    "description": description,
                    "status": false,
                    "subtasks": {},
                },
            },
        }));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Created task", TaskId: taskId }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
    catch (error) {
        console.error("Error creating task:", {
            user: userId,
            projectId: projectId,
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
