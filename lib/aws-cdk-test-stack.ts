import * as path from "path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambdaEventSource from "aws-cdk-lib/aws-lambda-event-sources";

export class AwsCdkTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, "AwsCdkTestQueue", {
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    const lambdaA = new NodejsFunction(this, "LambdaA", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, `/../functions/lambdaA.ts`),
      handler: "index.handler",
      environment: {
        QUEUE_URL: queue.queueUrl,
      },
    });

    queue.grantSendMessages(lambdaA);

    const lambdaB = new NodejsFunction(this, "LambdaB", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      entry: path.join(__dirname, `/../functions/lambdaB.ts`),
    });

    lambdaB.addEventSource(
      new lambdaEventSource.SqsEventSource(queue, {
        batchSize: 1,
      })
    );
  }
}
