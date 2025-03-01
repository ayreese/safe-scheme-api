import {PostConfirmationTriggerEvent} from "aws-lambda";
import {safeSchemeTasks, createDemoTasks} from "../../utils/mockEvent";
import {responseHeaders} from "../../utils/headers";
import crypto from "crypto";
import {client} from "../../utils/dynamoClient";
import {PutCommand} from "@aws-sdk/lib-dynamodb";


export const demoProjectsHandler = async (event: PostConfirmationTriggerEvent) => {
    const tableName: string | undefined = process.env.PROJECTS_TABLE;
    const userId: string = event.request.userAttributes.userId;
    const tasks = createDemoTasks(safeSchemeTasks);

    if (!tableName || !userId) {
        console.warn("Demo projects couldn't be created");
        throw new Error("Problem creating demo projects");
    }

    try {
        await client.send(new PutCommand({
            TableName: tableName,
            Item: {
                UserId: userId,
                ProjectId: crypto.randomUUID(),
                Project: "Learn Safe Scheme",
                Status: false,
                Tasks: tasks
            }
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({message: "Created project"}),
            headers: responseHeaders
        };
    } catch (error: any) {
        console.error("Error creating project:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to create project",
                error: error.message,
            }),
            headers: responseHeaders
        };
    }

};
