import { Consumer } from "sqs-consumer";
import AWS from "aws-sdk";

const credentials = new AWS.SharedIniFileCredentials({ profile: "default" });

AWS.config.update({ credentials: credentials, region: "eu-north-1" });

export const processMessage = async (message: AWS.SQS.Message) => {
  if (
    !message.MessageAttributes["ID"].StringValue ||
    !message.MessageAttributes["Name"].StringValue
  ) {
    throw new Error("Missing fields");
  }

  console.log(message.MessageAttributes["ID"]);
  console.log(message.MessageAttributes["Name"]);

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
  throw new Error("something went wrong: " + err.message);
});

app.on("processing_error", (err) => {
  console.error(err.message);
  throw new Error("something went wrong: " + err.message);
});

if (require.main === module) {
  app.start();
  console.log("queue service is running");
}

export default app;

// tag-contract:
// if: ${{ github.event.pull_request.state == 'closed'}}
// runs-on: ubuntu-latest
// steps:
//   - name: Checkout
//     uses: actions/checkout@v2
//   - name: Setup Node.js
//     uses: actions/setup-node@v1
//     with:
//       node-version: 14
//   - name: Install dependencies
//     run: yarn install --frozen-lockfile
//   - uses: ./.github/actions/release
//     with:
//       stage: dev
//       version: ${{ github.event.pull_request.head.sha }}
//       pacticipant: $PACTICIPANT
