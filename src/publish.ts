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

// add comment to generate new git version

new Publisher(opts)
  .publishPacts()
  .then(() => {
    console.log("successfully published to pact broker");
  })
  .catch((e) => {
    console.log("Pact contract publishing failed: ", e);
  });
