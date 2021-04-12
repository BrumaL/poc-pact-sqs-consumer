import { Consumer } from "sqs-consumer";
import AWS from "aws-sdk";

const credentials = new AWS.SharedIniFileCredentials({ profile: "default" });

AWS.config.update({ credentials: credentials, region: "eu-north-1" });

export const processMessage = async (message: AWS.SQS.Message) => {
  if (
    !message.MessageAttributes["Country"] ||
    !message.MessageAttributes["Region"]
  ) {
    throw new Error("Missing fields");
  }

  return;
};

const app = Consumer.create({
  queueUrl:
    "https://sqs.eu-north-1.amazonaws.com/286643423608/vs-prto-test-queue",
  handleMessage: async (message) => processMessage(message),
  sqs: new AWS.SQS(),
  messageAttributeNames: ["All"],
});

app.on("error", (err) => {
  console.error(err.message);
});

app.on("processing_error", (err) => {
  console.error(err.message);
});

console.log("queue service is running");
app.start();

export default app;
