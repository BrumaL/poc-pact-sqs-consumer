import {
  MessageConsumerPact,
  synchronousBodyHandler,
} from "@pact-foundation/pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import path from "path";

import { processMessage } from "../src/index";

describe("consumer of sqs queue", () => {
  // Pact Message Consumer
  const messagePact = new MessageConsumerPact({
    consumer: "MartinsMessageConsumer",
    dir: path.resolve(process.cwd(), "pacts"),
    pactfileWriteMode: "update",
    provider: "MartinsMessageProvider",
  });

  it("accepts a valid create product message", async () => {
    await expect(
      // Consumer expectations
      messagePact
        .expectsToReceive("create product event")
        .withContent({
          Message: like("string"),
          MessageAttributes: {
            ID: {
              DataType: like("number"),
              StringValue: like("1234"),
            },
            Name: {
              DataType: like("string"),
              StringValue: like("polestar 1"),
            },
          },
        })
        .withMetadata({
          "content-type": "application/json",
        })
        // Verify consumers' ability to handle messages
        .verify(synchronousBodyHandler(processMessage))
    ).resolves.not.toThrow();
  });
});
