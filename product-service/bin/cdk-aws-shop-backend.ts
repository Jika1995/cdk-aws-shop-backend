#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
// import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
// import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';

export const app = new cdk.App();

export const productServiceStack = new cdk.Stack(app, 'ProductServiceStack', {
    env: { region: 'us-east-1' }
})

const sharedLambdaProps: Partial<NodejsFunctionProps> = {
    runtime: lambda.Runtime.NODEJS_18_X,
    environment: {
        PRODUCT_AWS_REGION: process.env.PRODUCT_AWS_REGION!,
    }
}

const getProductsList = new NodejsFunction(productServiceStack, 'GetProductListLambda', {
    ...sharedLambdaProps,
    functionName: 'getProductsList',
    entry: 'src/handlers/getProductsList.ts'
});

const api = new apiGateway.HttpApi(productServiceStack, 'ProductApi', {
    corsPreflight: {
        allowHeaders: ['*'],
        allowOrigins: ['*'],
        allowMethods: [apiGateway.CorsHttpMethod.ANY]
    }
})

api.addRoutes({
    integration: new HttpLambdaIntegration('GetProductsListIntegration', getProductsList),
    path: '/products',
    methods: [apiGateway.HttpMethod.GET]
})

const getProductById = new NodejsFunction(productServiceStack, 'GetProductByIdLambda', {
    ...sharedLambdaProps,
    functionName: 'getProductById',
    entry: 'src/handlers/getProductById.ts'
})

api.addRoutes({
    integration: new HttpLambdaIntegration('GetProductByIdIntegration', getProductById),
    path: '/products/{productId}',
    methods: [apiGateway.HttpMethod.GET]
})