"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectHandler = void 0;
const crypto_1 = __importDefault(require("crypto"));
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamoClient_1 = require("../../utils/dynamoClient");
const headers_1 = require("../../utils/headers");
const { createPhases } = require("../../utils/functions");
const createProjectHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        throw new Error("PROJECTS_TABLE environment variable is not set.");
    }
    if (!event.body || !event.requestContext.authorizer) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Request body and authorization are required" }),
            headers: headers_1.responseHeaders
        };
    }
    const project = JSON.parse(event.body);
    const { Name: name, Phases: phasesArray } = project;
    const userId = event.requestContext.authorizer.claims.sub;
    if (!name || !phasesArray) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Project name and status are required" }),
            headers: headers_1.responseHeaders
        };
    }
    try {
        const projectId = crypto_1.default.randomUUID();
        const data = await dynamoClient_1.client.send(new lib_dynamodb_1.PutCommand({
            TableName: tableName,
            Item: {
                UserId: userId,
                ProjectId: projectId,
                Project: name,
                Phases: createPhases(phasesArray),
                Status: false
            }
        }));
        const statusCode = data.$metadata.httpStatusCode;
        return {
            statusCode: statusCode || 200,
            body: JSON.stringify({ message: "Created project", ProjectId: projectId }),
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
exports.createProjectHandler = createProjectHandler;
