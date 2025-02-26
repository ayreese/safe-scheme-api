"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const config = new client_dynamodb_1.DynamoDBClient({
    region: "us-east-1",
    logger: console,
});
exports.client = lib_dynamodb_1.DynamoDBDocumentClient.from(config);
