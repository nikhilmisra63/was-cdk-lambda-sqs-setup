import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const client = new SQSClient();

export const handler = async (event: any) => {
  console.log(JSON.stringify(event));

  for (const record of event.Records) {
    console.log(record);
  }
  return { statusCode: 200 };
};
