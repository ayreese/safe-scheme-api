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

    if (!event.requestContext.authorizer) {
        console.log("Function event:", event);
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Missing required parameters (body, user, projectId)"}),
            headers: responseHeaders
        };
    }

    const userId = event.requestContext.authorizer.claims.sub;

    if (!event.body) {
        console.log("Function event:", event);
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Unauthorized"}),
            headers: responseHeaders
        };
    }

    const projectParameters = JSON.parse(event.body);
    const {ProjectId: projectId, Project: name} = projectParameters;

    try {
        await client.send(new UpdateCommand({
            TableName: tableName,
            Key: {
                UserId: userId,
                ProjectId: projectId,
            },
            ConditionExpression: "ProjectId = :ProjectId",
            UpdateExpression: "SET #Project = :Project",
            ExpressionAttributeNames: {
                "#Project": "Project",
            },
            ExpressionAttributeValues: {
                ":ProjectId": projectId,
                ":Project": name,
            },
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({message: "Project updated successfully"}),
            headers: responseHeaders
        };
    } catch (error: any) {
        console.error("Error updating name:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Failed to update name", error: error.message}),
            headers: responseHeaders
        };
    }
};
