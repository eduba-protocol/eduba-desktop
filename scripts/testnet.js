const createTestnet = require("@hyperswarm/testnet");

async function main() {
  const testnet = await createTestnet(3); // create a local testnet with 3 dht nodes
  const [bootstrap] = testnet.bootstrap;
  console.info(
    `export DHT_BOOTSTRAP_NODES="${bootstrap.host}:${bootstrap.port}"`
  );
}

main().catch(console.error);
