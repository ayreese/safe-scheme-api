"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoProjectHandler = void 0;
const crypto_1 = __importDefault(require("crypto"));
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamoClient_1 = require("../../utils/dynamoClient");
const tasks_1 = require("../../utils/tasks");
const functions_1 = require("../../utils/functions");
const demoProjectHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        console.error('PROJECTS_TABLE environment variable is not set.');
        throw new Error('PROJECTS_TABLE environment variable is not set.');
    }
    if (!event.userName) {
        console.error('No user name');
        throw new Error('no userName variable is set.');
    }
    const userId = event.userName;
    try {
        const phaseValues = (0, functions_1.createPhases)(["Todo", "In Progress", "Complete"]);
        const projectId = crypto_1.default.randomUUID();
        await dynamoClient_1.client.send(new lib_dynamodb_1.PutCommand({
            TableName: tableName,
            Item: {
                UserId: userId,
                ProjectId: projectId,
                Project: 'Learn Safe Scheme',
                Phases: (0, functions_1.phaseTask)(phaseValues, tasks_1.tasksList),
                Status: false,
            },
        }));
    }
    catch (error) {
        console.error('Error creating project:', error);
    }
};
exports.demoProjectHandler = demoProjectHandler;
