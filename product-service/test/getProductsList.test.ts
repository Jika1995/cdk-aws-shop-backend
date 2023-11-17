import { handler } from '../src/handlers/getProductsList';
import { PRODUCTS } from '../src/constants';
import { buildResponse } from "../src/utils";

describe('render product list', () => {
    test('need to return products list array', async () => {
        const response = await handler();
        expect(response).toEqual(buildResponse(200, PRODUCTS))
    })

    test('error', async () => {
        try {
            const response = await handler()
        } catch {
            const mockError = new Error('Test Error');
            const res = buildResponse(500, {
                mockError
            })

            expect(res).toEqual(buildResponse(500, {
                mockError
            }))
        }

    })
})