import { getContract } from "thirdweb";
import { client, rootstockTestnet } from "./config";

const CONTRACT_ADDRESS = "0xD2322d9cc6Ee1A96aBfe43B46EEa26fd3B9C4133";

if (!CONTRACT_ADDRESS) {
  console.warn(
    "⚠️ No contract address provided."
  );
}

export const contract = getContract({
  client,
  chain: rootstockTestnet,
  address: CONTRACT_ADDRESS,
});
