import { createThirdwebClient } from "thirdweb";
import { sepolia } from 'thirdweb/chains';
import { getContract} from 'thirdweb';

export const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;
const contractFactoryAddress = import.meta.env.VITE_THIRDWEB_FACTORY_ADDRESS;

export const client = createThirdwebClient({
  clientId: clientId,
});

export const electionFactoryContract = getContract({
  client: client,
  chain: sepolia,
  address: contractFactoryAddress,
});

export const singleElectionContract = (address: string) => {
  return getContract({
    client: client,
    chain: sepolia,
    address: address,
  });
}