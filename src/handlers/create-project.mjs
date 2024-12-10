import {ddbDocClient} from "../../utils/dynamoClient.mjs";
import crypto from 'crypto';
import {validateBody} from "../../functions/validate.mjs";
import {PutCommand} from "@aws-sdk/lib-dynamodb";
import {tasksHelper} from "../../functions/tasks-helper.mjs";

// Function to get user from table
export const createProjectHandler = async (event) => {
    const table = process.env.PROJECTS_TABLE;
    await validateBody(event);
    const {projectName, tasks} = event;
    const userID = crypto.randomBytes(8).toString('hex'); // Generate userID
    const projectID = crypto.randomBytes(8).toString('hex'); // Generate projectID

    const params = {
        TableName: table,
        Item: {
            'user-id': userID,
            'project-id': projectID,
            'project-name': projectName,
            tasks: tasksHelper(tasks),
        }
    };

    try {
        console.log("Inserting project with params:", params.Item);
        await ddbDocClient.send(new PutCommand(params));
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
