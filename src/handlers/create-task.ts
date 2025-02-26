import {client} from "../../utils/dynamoClient";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {APIGatewayEvent} from "aws-lambda";

export const createTaskHandler = async (event: APIGatewayEvent) => {
  if (event.body && event.requestContext.authorizer && event.pathParameters) {
      const taskProperties = JSON.parse(event.body);
      const tableName = process.env.PROJECTS_TABLE;
      const projectId = event.pathParameters.ProjectId;
      const {TaskDescription} = taskProperties;
      const userId = event.requestContext.authorizer.claims.sub; // Get userId from event provided by cognito
      const taskId = crypto.randomUUID();


      try {
          const data = await client.send(new UpdateCommand({
              TableName: tableName,
              Key: {
                  UserId: userId,
                  ProjectId: projectId,
              },
              ConditionExpression: "ProjectId = :ProjectId",
              UpdateExpression: "SET Tasks.#TaskId = :TaskData",
              ExpressionAttributeNames: {
                  "#TaskId": taskId,
              },
              ExpressionAttributeValues: {
                  ":TaskData": {
                      "Description": TaskDescription,
                      "Status": false,
                      "Subtasks": {}
                  },
                  ":ProjectId": projectId,
              }
          }))
          return {
              statusCode: 200,
              body: JSON.stringify({data: data})
          }
      } catch (error: any) {
          return {
              statusCode: 500,
              body: JSON.stringify({message: "Failed to create task", error: error.message})
          };
      }
  } else {
      throw new Error("Body must be provided");
  }
};
