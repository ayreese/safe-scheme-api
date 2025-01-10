import {client} from "../../utils/dynamoClient.mjs";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
// import {tasksHelper} from "../../functions/tasks-helper.mjs";

export const editProjectHandler = async (event) => {
    const project = JSON.parse(event.body);
    const tableName = process.env.PROJECTS_TABLE;
    const projectId = event.pathParameters.ProjectId;
    const {ProjectName: projectName} = project;

    try {
        const data = await client.send(new UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: "e1df74f8610de4bd",
                ProjectId: projectId,
            },
            ConditionExpression: "ProjectId = :projectId",
            UpdateExpression: "set ProjectName = :projectName",
            ExpressionAttributeValues: {
                ":projectId": projectId,
                ":projectName": projectName,
            }
        }))
        return {
            statusCode: 200,
            body: JSON.stringify({data: data})
        }
    } catch (error) {
        console.error(error);
    }
};
