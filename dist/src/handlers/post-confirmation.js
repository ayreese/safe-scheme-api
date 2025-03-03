"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoProjectHandler = void 0;
const crypto_1 = __importDefault(require("crypto"));
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamoClient_1 = require("../../utils/dynamoClient"); // Your DynamoDB client
const tasks_1 = require("../../utils/tasks"); // A helper function that creates tasks
/**
 * This function is triggered by Cognito after user confirmation.
 * It will create a demo project for the new user.
 */
const demoProjectHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        throw new Error('PROJECTS_TABLE environment variable is not set.');
    }
    const userId = event.request.userAttributes.sub; // Use 'sub' as the user identifier
    try {
        const projectId = crypto_1.default.randomUUID(); // Generate a unique project ID
        await dynamoClient_1.client.send(new lib_dynamodb_1.PutCommand({
            TableName: tableName,
            Item: {
                UserId: userId,
                ProjectId: projectId,
                Project: 'Learn Safe Scheme', // A demo project
                Status: false, // Project status (e.g., not started)
                Tasks: (0, tasks_1.createTasks)(), // Initial tasks
            },
        }));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Created project', ProjectId: projectId }),
            headers: {
                'Content-Type': 'application/json',
            },
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
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
};
exports.demoProjectHandler = demoProjectHandler;
