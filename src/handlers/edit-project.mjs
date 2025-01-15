import {client} from "../../utils/dynamoClient.mjs";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";

export const editProjectHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    const projectParameters = JSON.parse(event.body);
    const userId = event.requestContext.authorizer.claims.sub;
    const projectId = event.pathParameters.ProjectId;
    const {Project: project} = projectParameters;

    try {
        const data = await client.send(new UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            ConditionExpression: "ProjectId = :ProjectId",
            UpdateExpression: "SET Project = :Project",
            ExpressionAttributeValues: {
                ":ProjectId": projectId,
                ":Project": project,
            }
        }))
        return {
            statusCode: 200,
            body: JSON.stringify({data: data})
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: error.message})
        }
    }
};
