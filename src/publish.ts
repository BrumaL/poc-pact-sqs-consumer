import { Publisher } from "@pact-foundation/pact";
import path from "path";

const opts = {
  pactFilesOrDirs: [path.resolve(process.cwd(), "pacts")],
};

new Publisher(opts).publishPacts().then(() => {
  console.log("successfully published to pact");
});
