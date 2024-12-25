import {ddbDocClient} from "../../utils/dynamoClient.mjs";
import crypto from 'crypto';
import {PutCommand} from "@aws-sdk/lib-dynamodb";
import {tasksHelper} from "../../functions/tasks-helper.mjs";

export const createProjectHandler = async (event) => {
    const table = "ProjectsTable";
    const {ProjectName: projectName, Tasks: tasks} = event;
    const userId = crypto.randomBytes(8).toString('hex'); // Generate userId
    const projectId = crypto.randomBytes(8).toString('hex'); // Generate projectId

    try {
        console.log("Creating Project");
        await ddbDocClient.send(new PutCommand({
            TableName: table,
            Item: {
                UserId: userId,
                ProjectId: projectId,
                ProjectName: projectName,
                Tasks: tasksHelper(tasks),
            }
        }));
        console.info(`Successfully created project: ${projectName}`);
        return {
            statusCode: 200,
            body: JSON.stringify({message: "Created project"})
        };
    } catch (e) {
        console.error("Error creating project", e);
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Failed to create project", error: e.message})
        };
    }
};
