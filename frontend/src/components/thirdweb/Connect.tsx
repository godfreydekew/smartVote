import { ConnectButton } from "thirdweb/react";
import { client } from "@/utils/thirdweb-client";
import { inAppWallet } from "thirdweb/wallets";
import { sepolia } from "thirdweb/chains";

export const wallets = [
  inAppWallet({
    auth: {
      options: [
        // "google",
        "email",
      ],
    },
    // smartAccount: {
    //   chain: sepolia,
    //   sponsorGas: false,
    // },
  }),
];

export function Connect() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      connectModal={{ size: "compact" }}
      connectButton={
        {
            label: "Verify Email",
        }
      }
    />
  );
}