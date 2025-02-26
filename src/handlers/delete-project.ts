import {client} from "../../utils/dynamoClient";
import {DeleteCommand} from "@aws-sdk/lib-dynamodb";
import {APIGatewayEvent} from "aws-lambda";

export const deleteProjectHandler = async (event: APIGatewayEvent) => {
   if (event.pathParameters ) {
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
               ConditionExpression: "ProjectId = :ProjectId",
               ExpressionAttributeValues: {
                   ":ProjectId": projectId,
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
   } else {
       throw new Error("Unable to delete project");
   }
};
