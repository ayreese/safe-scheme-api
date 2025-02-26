/*
To create a userID to test function use:
const userId = crypto.randomBytes(8).toString('hex');
*/
import {APIGatewayEvent} from "aws-lambda"
import crypto from 'crypto';
import {PutCommand} from "@aws-sdk/lib-dynamodb";
import {client} from "../../utils/dynamoClient"

export const createProjectHandler = async (event:APIGatewayEvent) => {
    if (event.body != null && event.requestContext.authorizer) {
        const project = JSON.parse(event.body);
        const tableName = process.env.PROJECTS_TABLE; // DynamoDB table in SAM template
        const {Project: projectName, Status: status} = project;
        const userId = event.requestContext.authorizer.claims.sub; // Get userId from event provided by cognito

        try {
            await client.send(new PutCommand({
                TableName: tableName,
                Item: {
                    UserId: userId,
                    ProjectId: crypto.randomUUID(),
                    Project: projectName,
                    Status: status,
                    Tasks: {},
                }
            }));
            // Return 201 and message if successful
            return {
                statusCode: 201,
                body: JSON.stringify({message: "Created project"})
            };
        } catch (error:any) {
            // Return 500 on failure
            return {
                statusCode: 500,
                body: JSON.stringify({message: "Failed to create project", error: error.message})
            };
        }
    } else {
        throw new Error("Body must be provided");
    }

};
