// import { PRODUCTS } from '../constants';
import { buildResponse } from '../utils';
import * as AWS from 'aws-sdk';

const db = new AWS.DynamoDB.DocumentClient()

const getFromTable = async (arg: string) => {
    console.log(arg);

    const params = {
        TableName: arg
    }
    const response = await db.scan(params).promise();
    return response.Items
}

export const handler = async (event: any = {}) => {

    console.log(`Request: ${event}`);

    try {

        const products = await getFromTable('products');
        const stock = await getFromTable('stock');

        if (!products || !stock) {
            return buildResponse(404,
                'Error: There is no products or stocks'
            )
        }

        let joinedArray = products.map(product => {
            let counted = stock.find(element => element.product_id === product.id)
            return { ...product, ...counted }
        })

        return buildResponse(200,
            joinedArray
        );
    } catch (err: unknown) {
        return buildResponse(500, {
            err
        })
    }
}