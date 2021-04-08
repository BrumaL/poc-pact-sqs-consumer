const { Publisher } = require("@pact-foundation/pact");
const path = require("path");
const { versionFromGitTag } = require("@pact-foundation/absolute-version");

const consumerVersion = versionFromGitTag();

const opts = {
  pactFilesOrDirs: [path.resolve(process.cwd(), "pacts")],
  pactBroker: "https://meklund.pactflow.io/",
  pactBrokerToken: "oqC6W6RnlmMgp-NhQfapBw",
  tags: ["master"],
  consumerVersion,
};

new Publisher(opts).publishPacts().then(() => {
  console.log("successfully published to pact");
});
