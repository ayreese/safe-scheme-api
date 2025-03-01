"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoProjectsHandler = void 0;
const mockEvent_1 = require("../../utils/mockEvent");
const headers_1 = require("../../utils/headers");
const crypto_1 = __importDefault(require("crypto"));
const dynamoClient_1 = require("../../utils/dynamoClient");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const demoProjectsHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    const userId = event.request.userAttributes.userId;
    const tasks = (0, mockEvent_1.createDemoTasks)(mockEvent_1.safeSchemeTasks);
    if (!tableName || !userId) {
        console.warn("Demo projects couldn't be created");
        throw new Error("Problem creating demo projects");
    }
    try {
        await dynamoClient_1.client.send(new lib_dynamodb_1.PutCommand({
            TableName: tableName,
            Item: {
                UserId: userId,
                ProjectId: crypto_1.default.randomUUID(),
                Project: "Learn Safe Scheme",
                Status: false,
                Tasks: tasks
            }
        }));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Created project" }),
            headers: headers_1.responseHeaders
        };
    }
    catch (error) {
        console.error("Error creating project:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to create project",
                error: error.message,
            }),
            headers: headers_1.responseHeaders
        };
    }
};
exports.demoProjectsHandler = demoProjectsHandler;
