// import { PRODUCTS } from '../constants';
import { buildResponse } from '../utils'
import * as AWS from 'aws-sdk';

const db = new AWS.DynamoDB.DocumentClient()

export const handler = async (event: any = {}) => {
    console.log(`Request: ${event}`);

    const itemId = event.pathParameters.productId;

    if (!itemId) {
        return buildResponse(400, 'Error: you are missing the path parameter id')
    }

    const params = {
        TableName: 'products',
        Key: {
            id: itemId
        }
    }

    try {
        const response = await db.get(params).promise();

        if (response.Item) {
            return buildResponse(200,
                response.Item
            );
        } else {
            return buildResponse(404, 'Not found')
        }

    } catch (err: unknown) {
        return buildResponse(500, {
            err
        })
    }
}