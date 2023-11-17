import { PRODUCTS } from '../constants';
import { buildResponse } from '../utils'

export const handler = async (event: any = {}) => {
    const itemId = event.pathParameters.productId;
    console.log(event.pathParameters, event);

    if (!itemId) {
        return buildResponse(400, 'Error: you are missing the path parameter id')
    }

    const itemToFind = PRODUCTS.find((item) => item.id === itemId)

    try {
        return buildResponse(200,
            itemToFind
        );
    } catch (err: unknown) {
        return buildResponse(500, {
            err
        })
    }
}