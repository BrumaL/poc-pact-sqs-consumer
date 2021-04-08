import { Publisher } from "@pact-foundation/pact";
import path from "path";
const { versionFromGitTag } = require("@pact-foundation/absolute-version");

const consumerVersion = versionFromGitTag();

console.log("versionFromGitTag: ", consumerVersion);

const opts = {
  pactFilesOrDirs: [path.resolve(process.cwd(), "pacts")],
  pactBroker: "https://mareklund.pactflow.io",
  consumerVersion,
};

new Publisher(opts).publishPacts().then(() => {
  console.log("successfully published to pact");
});
