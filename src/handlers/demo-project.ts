import { PostConfirmationTriggerEvent } from 'aws-lambda';
import crypto from 'crypto';
import {PutCommand} from '@aws-sdk/lib-dynamodb';
import {client} from '../../utils/dynamoClient';
import {tasksList} from "../../utils/tasks";
import {createPhases, phaseTask} from '../../utils/functions';


export const demoProjectHandler = async (event: PostConfirmationTriggerEvent): Promise<void> => {
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
        const phaseValues = createPhases(["Todo", "In Progress", "Complete"])
        const projectId = crypto.randomUUID();
        await client.send(
            new PutCommand({
                TableName: tableName,
                Item: {
                    UserId: userId,
                    ProjectId: projectId,
                    Project: 'Learn Safe Scheme',
                    Phases: phaseTask(phaseValues, tasksList),
                    Status: false,

                },
            }),
        );
    } catch (error: any) {
        console.error('Error creating project:', error);
    }
};
