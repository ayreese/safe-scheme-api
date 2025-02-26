"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectHandler = void 0;
const crypto_1 = __importDefault(require("crypto"));
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamoClient_1 = require("../../utils/dynamoClient");
const createProjectHandler = async (event) => {
    if (event.body != null && event.requestContext.authorizer) {
        const project = JSON.parse(event.body);
        const tableName = process.env.PROJECTS_TABLE; // DynamoDB table in SAM template
        const { Project: projectName, Status: status } = project;
        const userId = event.requestContext.authorizer.claims.sub; // Get userId from event provided by cognito
        try {
            await dynamoClient_1.client.send(new lib_dynamodb_1.PutCommand({
                TableName: tableName,
                Item: {
                    UserId: userId,
                    ProjectId: crypto_1.default.randomUUID(),
                    Project: projectName,
                    Status: status,
                    Tasks: {},
                }
            }));
            // Return 201 and message if successful
            return {
                statusCode: 201,
                body: JSON.stringify({ message: "Created project" })
            };
        }
        catch (error) {
            // Return 500 on failure
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Failed to create project", error: error.message })
            };
        }
    }
    else {
        throw new Error("Body must be provided");
    }
};
exports.createProjectHandler = createProjectHandler;
