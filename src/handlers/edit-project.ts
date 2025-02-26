import {client} from "../../utils/dynamoClient";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {APIGatewayEvent} from "aws-lambda";

export const editProjectHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;
    if(event.body && event.requestContext.authorizer && event.pathParameters) {
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
        } catch (error: any) {
            return {
                statusCode: 500,
                body: JSON.stringify({error: error.message})
            }
        }
    }

};
