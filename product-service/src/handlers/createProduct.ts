import * as AWS from 'aws-sdk';
import { buildResponse } from '../utils';

const db = new AWS.DynamoDB.DocumentClient()

type Product = {
    title: string;
    description: string;
    price: number
}

const validateProductData = (productData: Product) => {

    if (!productData.title || !productData.price || !productData.description) {
        return 'Error: Invalid product data. Missing required fields.';
    }

    return null;
};

export const handler = async (event: any = {}) => {
    console.log(`Request: ${event}`);

    if (!event.body) {
        return buildResponse(400, 'Error: you are missing the parameter body')
    }
    const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);

    const validationError = validateProductData(item);
    if (validationError) {
        return buildResponse(400, validationError);
    }

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