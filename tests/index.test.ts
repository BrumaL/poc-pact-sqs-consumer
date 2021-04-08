// import { person } from "../src/index";
// import Validator from "jsonschema";

// import Person from "../src/models/Person";
// import personSchema from "../src/schema/personSchema.json";

// describe("app", () => {
//   it("validates personSchema contract", async () => {
//     const mockedPerson: Person = {
//       age: 30,
//       fullName: "Martin Eklund",
//       gender: "male",
//     };

//     const spy = jest.spyOn(person, "create");
//     person.create(mockedPerson);

//     const validationResult = Validator.validate(mockedPerson, personSchema)
//       .valid;

//     expect(validationResult).toBeTruthy();
//     expect(spy).toHaveBeenCalledWith(mockedPerson);
//   });
// });

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
        .expectsToReceive("a message from the queue")
        .withContent({
          Country: {
            DataType: like("string"),
            StringValue: like("sweden"),
          },
          Region: {
            DataType: like("string"),
            StringValue: like("europe"),
          },
        })
        .withMetadata({
          "content-type": "application/json",
        })
        // Verify consumers' ability to handle messages
        .verify(synchronousBodyHandler(processMessage))
    ).resolves.not.toThrow();
  });

  it("expects to throw an error", async () => {
    await expect(
      messagePact
        .expectsToReceive("Missing fields")
        .withContent({
          Country: {
            DataType: like("string"),
            StringValue: like("sweden"),
          },
        })
        .withMetadata({
          "content-type": "application/json",
        })
        .verify(synchronousBodyHandler(processMessage))
    ).rejects.toThrow("Missing fields");
  });
});
