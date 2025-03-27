import {client} from "../../utils/dynamoClient";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {APIGatewayEvent} from "aws-lambda";
import {responseHeaders} from "../../utils/headers";

export const editProjectHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: "No table name provided"}),
            headers: responseHeaders
        };
    }

    if (!event.body || !event.requestContext.authorizer) {
        console.log("Function event:", event);
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Missing required parameters (body, user, projectId)"}),
            headers: responseHeaders
        };
    }

    const projectParameters = JSON.parse(event.body);
    const userId = event.requestContext.authorizer.claims.sub;
    const {Project: project, ProjectId: projectId} = projectParameters;

    try {
        await client.send(new UpdateCommand({
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
            },
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({message: "Project updated successfully"}),
            headers: responseHeaders
        };
    } catch (error: any) {
        console.error("Error updating project:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Failed to update project", error: error.message}),
            headers: responseHeaders
        };
    }
};
