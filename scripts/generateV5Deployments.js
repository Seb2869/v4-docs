#!/usr/bin/env node
const fs = require("fs");
const chalk = require("chalk");

// Chain Ids
// Mainnet
const ETHEREUM_CHAIN_ID = 1;
const ARBITRUM_CHAIN_ID = 42161;
const BSC_CHAIN_ID = 56;
const CELO_CHAIN_ID = 42220;
const GNOSIS_CHAIN_ID = 100;
const OPTIMISM_CHAIN_ID = 10;
const POA_SOKOL_CHAIN_ID = 77;
const POLYGON_CHAIN_ID = 137;
const BASE_CHAIN_ID = 8453;
const SCROLL_CHAIN_ID = 534352;
const WORLD_CHAIN_ID = 480;

// Testnet
const ARBITRUM_GOERLI_CHAIN_ID = 421613;
const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;
const BSC_TESTNET_CHAIN_ID = 97;
const CELO_ALFAJORES_CHAIN_ID = 44787;
const GOERLI_CHAIN_ID = 5;
const MUMBAI_CHAIN_ID = 80001;
const OPTIMISM_GOERLI_CHAIN_ID = 420;
const OPTIMISM_SEPOLIA_CHAIN_ID = 11155420;
const SEPOLIA_CHAIN_ID = 11155111;
const BASE_SEPOLIA_CHAIN_ID = 84532;
const GNOSIS_CHIADO_CHAIN_ID = 10200;
const SCROLL_SEPOLIA_CHAIN_ID = 534351;

function formatAddressUrl(chainId, address) {
  let url;
  if (chainId == ETHEREUM_CHAIN_ID) {
    url = `https://etherscan.io/address/${address}`;
  } else if (chainId == GOERLI_CHAIN_ID) {
    url = `https://goerli.etherscan.io/address/${address}`;
  } else if (chainId == SEPOLIA_CHAIN_ID) {
    url = `https://sepolia.etherscan.io/address/${address}`;
  } else if (chainId == ARBITRUM_CHAIN_ID) {
    url = `https://arbiscan.io/address/${address}`;
  } else if (chainId == ARBITRUM_GOERLI_CHAIN_ID) {
    url = `https://goerli.arbiscan.io/address/${address}`;
  } else if (chainId == ARBITRUM_SEPOLIA_CHAIN_ID) {
    url = `https://sepolia.arbiscan.io/address/${address}`;
  } else if (chainId == BSC_CHAIN_ID) {
    url = `https://bscscan.com/address/${address}`;
  } else if (chainId == POA_SOKOL_CHAIN_ID) {
    url = `https://blockscout.com/poa/sokol/address/${address}`;
  } else if (chainId == BSC_TESTNET_CHAIN_ID) {
    url = `https://testnet.bscscan.com/address/${address}`;
  } else if (chainId == GNOSIS_CHAIN_ID) {
    url = `https://gnosisscan.io/address/${address}`;
  } else if (chainId == GNOSIS_CHIADO_CHAIN_ID) {
    url = `https://gnosis-chiado.blockscout.com/address/${address}`;
  } else if (chainId == POLYGON_CHAIN_ID) {
    url = `https://polygonscan.com/address/${address}`;
  } else if (chainId == OPTIMISM_CHAIN_ID) {
    url = `https://optimistic.etherscan.io/address/${address}`;
  } else if (chainId == OPTIMISM_GOERLI_CHAIN_ID) {
    url = `https://goerli-optimism.etherscan.io/address/${address}`;
  } else if (chainId == OPTIMISM_SEPOLIA_CHAIN_ID) {
    url = `https://sepolia-optimism.etherscan.io/address/${address}`;
  } else if (chainId == MUMBAI_CHAIN_ID) {
    url = `https://mumbai.polygonscan.com/address/${address}`;
  } else if (chainId == CELO_CHAIN_ID) {
    url = `https://explorer.celo.org/address/${address}`;
  } else if (chainId == CELO_ALFAJORES_CHAIN_ID) {
    url = `https://alfajores-blockscout.celo-testnet.org/address/${address}`;
  } else if (chainId == BASE_SEPOLIA_CHAIN_ID) {
    url = `https://sepolia.basescan.org/address/${address}`;
  } else if (chainId == BASE_CHAIN_ID) {
    url = `https://basescan.org/address/${address}`;
  } else if (chainId == SCROLL_CHAIN_ID) {
    url = `https://scrollscan.com/address/${address}`;
  } else if (chainId == SCROLL_SEPOLIA_CHAIN_ID) {
    url = `https://sepolia.scrollscan.com/address/${address}`;
  } else if (chainId == WORLD_CHAIN_ID) {
    url = `https://worldscan.org/address/${address}`;
  } else {
    throw new Error(`Unknown chain id ${chainId}`);
  }
  return url;
}

const append = (out, str) => {
  fs.writeSync(out, str + "\n");
};

async function generate(name, sidebar_position, outputFilePath, inputFilePaths) {
  const outputFile = fs.openSync(outputFilePath, "w");

  append(outputFile, `---`);
  append(outputFile, `title: ${name}`);
  append(outputFile, `sidebar_position: ${sidebar_position}`);
  append(outputFile, `---`);
  append(outputFile, ``);
  append(outputFile, `# ${name}`);
  append(outputFile, ``);

  inputFilePaths.map((inputFilePath) => {
    const contracts = JSON.parse(fs.readFileSync(inputFilePath));
    const networks = {};

    contracts.contracts.map(({ chainId, address, type }) => {
      if (!networks[chainId]) {
        networks[chainId] = [];
      }
      networks[chainId].push({ address, type });
    });

    const chainIds = Object.keys(networks);

    for (let i = 0; i < chainIds.length; i++) {
      const chainId = chainIds[i];
      const contracts = networks[chainId];

      append(outputFile, `| Contract | Address |`);
      append(outputFile, `| :--- | :--- |`);
      append(
        outputFile,
        contracts
          .map(
            ({ type, address }) =>
              `| ${type} | [\`${address}\`](${formatAddressUrl(chainId, address)}) |`,
          )
          .join("\n"),
      );
      append(outputFile, "");
    }
  });

  fs.closeSync(outputFile);
  console.log(chalk.green(`Done!`));
}

switch (process.argv[2]) {
  case "optimism":
    generate("Optimism", 0, "./docs/deployments/optimism.md", [
      "./data/optimism-core.json",
    ]);
    break;
  
  case "base":
    generate("Base", 0, "./docs/deployments/base.md", [
      "./data/base-core.json",
    ]);
    break;
  
  case "arbitrum":
    generate("Arbitrum One", 0, "./docs/deployments/arbitrum.md", [
      "./data/arbitrum-core.json",
    ]);
    break;

  case "ethereum":
    generate("Ethereum", 0, "./docs/deployments/ethereum.md", [
      "./data/ethereum-core.json",
    ]);
    break;

  case "scroll":
    generate("Scroll", 0, "./docs/deployments/scroll.md", [
      "./data/scroll-core.json",
    ]);
    break;

  case "gnosis":
    generate("Gnosis", 0, "./docs/deployments/gnosis.md", [
      "./data/gnosis-core.json",
    ]);
    break;

  case "optimism-sepolia":
    generate("Optimism Sepolia", 1, "./docs/deployments/optimism-sepolia.md", [
      "./data/optimism-sepolia-core.json",
    ]);
    break;

  case "base-sepolia":
    generate("Base Sepolia", 1, "./docs/deployments/base-sepolia.md", [
      "./data/base-sepolia-core.json",
    ]);
    break;

  case "arbitrum-sepolia":
    generate("Arbitrum Sepolia", 1, "./docs/deployments/arbitrum-sepolia.md", [
      "./data/arbitrum-sepolia-core.json",
    ]);
    break;

  case "scroll-sepolia":
    generate("Scroll Sepolia", 1, "./docs/deployments/scroll-sepolia.md", [
      "./data/scroll-sepolia-core.json",
    ]);
    break;

  case "gnosis-chiado":
    generate("Gnosis Chiado", 1, "./docs/deployments/gnosis-chiado.md", [
      "./data/gnosis-chiado-core.json",
    ]);
    break;

  case "world":
    generate("World", 1, "./docs/deployments/world.md", [
      "./data/world-core.json",
    ]);
    break;

  default:
    break;
}
