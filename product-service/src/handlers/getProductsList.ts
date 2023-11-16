import { PRODUCTS } from '../constants';
import { buildResponse } from '../utils'

export const handler = async () => {
    try {
        return buildResponse(200,
            PRODUCTS
        );
    } catch (err: unknown) {
        return buildResponse(500, {
            err
        })
    }
}