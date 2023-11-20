import * as AWS from 'aws-sdk';
import { buildResponse } from '../utils';

const db = new AWS.DynamoDB.DocumentClient()

export const handler = async (event: any = {}) => {
    if (!event.body) {
        return buildResponse(400, 'Error: you are missing the parameter body')
    }
    const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);

    const params = {
        TableName: 'products',
        Item: item
    }

    try {
        await db.put(params).promise()
        return buildResponse(200, item)
    } catch (err: unknown) {
        return buildResponse(500, {
            err
        })
    }
}