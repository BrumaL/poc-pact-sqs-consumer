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

  it("accepts a valid message", async () => {
    await expect(
      // Consumer expectations
      messagePact
        .expectsToReceive("create country event")
        .withContent({
          Message: like("string"),
          MessageAttributes: {
            Country: {
              DataType: like("string"),
              StringValue: like("sweden"),
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

  // it("expects to throw an error", async () => {
  //   await expect(
  //     messagePact
  //       .expectsToReceive("Missing fields")
  //       .withContent({
  //         MessageAttributes: {
  //           Country: {
  //             DataType: like("string"),
  //             StringValue: like("sweden"),
  //           },
  //         },
  //       })
  //       .withMetadata({
  //         "content-type": "application/json",
  //       })
  //       .verify(synchronousBodyHandler(processMessage))
  //   ).rejects.toThrow("Missing fields");
  // });
});
