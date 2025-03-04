"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoProjectHandler = void 0;
const crypto_1 = __importDefault(require("crypto"));
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamoClient_1 = require("../../utils/dynamoClient");
const { createTasks } = require('../../utils/tasks');
const headers_1 = require("../../utils/headers");
const demoProjectHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        throw new Error('PROJECTS_TABLE environment variable is not set.');
    }
    if (!event.userName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Request authorization are required" }),
            headers: headers_1.responseHeaders
        };
    }
    const userId = event.userName;
    try {
        const projectId = crypto_1.default.randomUUID();
        await dynamoClient_1.client.send(new lib_dynamodb_1.PutCommand({
            TableName: tableName,
            Item: {
                UserId: userId,
                ProjectId: projectId,
                Project: 'Learn Safe Scheme',
                Status: false,
                Tasks: createTasks(),
            },
        }));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Created project', ProjectId: projectId }),
            headers: headers_1.responseHeaders
        };
    }
    catch (error) {
        console.error('Error creating project:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to create project',
                error: error.message,
            }),
            headers: headers_1.responseHeaders
        };
    }
};
exports.demoProjectHandler = demoProjectHandler;
