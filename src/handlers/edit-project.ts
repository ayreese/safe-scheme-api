import {client} from "../../utils/dynamoClient";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {APIGatewayEvent} from "aws-lambda";

export const editProjectHandler = async (event: APIGatewayEvent) => {
    const tableName = process.env.PROJECTS_TABLE;
    if (!tableName) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: "No table name provided"}),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    if (!event.body || !event.requestContext.authorizer || !event.pathParameters || !event.pathParameters.ProjectId) {
        console.log("Function event:", event);
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Missing required parameters (body, user, projectId)"}),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }

    const projectParameters = JSON.parse(event.body);
    const userId = event.requestContext.authorizer.claims.sub;
    const projectId = event.pathParameters.ProjectId;
    const {Project: project} = projectParameters;

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
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    } catch (error: any) {
        console.error("Error updating project:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Failed to update project", error: error.message}),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        };
    }
};
