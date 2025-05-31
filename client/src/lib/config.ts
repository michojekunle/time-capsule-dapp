
import { createThirdwebClient, defineChain } from "thirdweb";
import { inAppWallet, createWallet } from "thirdweb/wallets";

// Get client ID from environment variable
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID

if (!clientId) {
  console.warn(
    "⚠️ No thirdweb client ID found. Make sure NEXT_PUBLIC_THIRDWEB_CLIENT_ID is set in your environment variables.",
  )
}

export const client = createThirdwebClient({
  clientId: clientId || "",
})

export const rootstockTestnet = defineChain({
  id: 31,
  name: "Rootstock Testnet",
  rpc: "https://public-node.testnet.rsk.co",
  nativeCurrency: {
    name: "tRBTC",
    symbol: "tRBTC",
    decimals: 18,
  },
  blockExplorers: [
    { name: "RSK Testnet Explorer", url: "https://explorer.testnet.rootstock.io/" },
    { name: "Blockscout Testnet Explorer", url: "https://rootstock-testnet.blockscout.com/" },
  ],
  testnet: true,
});

export const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
      ],
    },
    smartAccount: {
      chain: rootstockTestnet,
      sponsorGas: true,
    }
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("io.rabby"),
];