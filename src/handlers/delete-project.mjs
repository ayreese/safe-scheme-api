import {client} from "../../utils/dynamoClient.mjs";
import {DeleteCommand} from "@aws-sdk/lib-dynamodb";

export const deleteProjectHandler = async (event) => {
    const tableName = process.env.PROJECTS_TABLE;
    const userId = event.pathParameters.UserId
    const projectId = event.pathParameters.ProjectId

    try {
        await client.send(new DeleteCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            ConditionExpression: "ProjectId = :projectId",
            ExpressionAttributeValues: {
                ":projectId": projectId,
            }
        }))
        return {
            statusCode: 204,

        };
    } catch (error) {
        return {
            statusCode: 404,
        }
    }
};
