import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const client = new SQSClient();

export const handler = async (event: any) => {
  const command = new SendMessageCommand({
    MessageBody: JSON.stringify({ message: "Hello from Lambda A" }),
    QueueUrl: process.env.QUEUE_URL,
  });
  await client.send(command);
  console.log("message sent");
  return { statusCode: 200, body: "message sent" };
};
