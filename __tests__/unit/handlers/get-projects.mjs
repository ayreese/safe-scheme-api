// Import getAllItemsHandler function from get-projects.mjs
import { getProjectsHandler } from '../../../src/handlers/get-projects.mjs';
// Import dynamodb from aws-sdk 
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from "aws-sdk-client-mock";
 
// This includes all tests for getProjectsHandler()
describe('Test getProjectsHandler', () => {
    const ddbMock = mockClient(DynamoDBDocumentClient);
 
    beforeEach(() => {
        ddbMock.reset();
      });
 
    it('should return ids', async () => { 
        const items = [{ id: 'id1' }, { id: 'id2' }]; 
 
        // Return the specified value whenever the spied scan function is called 
        ddbMock.on(QueryCommand).resolves({
            Items: items,
        }); 
 
        const event = { 
            httpMethod: 'GET' 
        };
 
        // Invoke helloFromLambdaHandler() 
        const result = await getProjectsHandler(event);
 
        const expectedResult = { 
            statusCode: 200, 
            body: JSON.stringify(items) 
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 
}); 
