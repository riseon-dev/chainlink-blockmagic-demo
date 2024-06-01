import {StateCreator} from "zustand";
import {createWalletClient, custom, WalletClient,} from 'viem'
import { sepolia } from 'viem/chains'
import 'viem/window';

export enum WalletStatus {
  connected = 'connected',
  disconnected = 'disconnected',
  connecting = 'connecting',
}

export interface Web3Slice {
  walletStatus: WalletStatus;
  walletAddress: string;
  walletClient?: WalletClient
  connectWallet: () => Promise<void>;
}

export const createWeb3Slice: StateCreator<
  Web3Slice ,
  [],
  [],
  Web3Slice
> = (set) => ({
  connectWallet: async () => {
    try {
      const status: WalletStatus = WalletStatus.connecting;
      set ({walletStatus: status});

      const client = createWalletClient({
        chain: sepolia,
        // eslint-disable-next-line
        // @ts-ignore
        transport: custom(window.ethereum)
      });

      const [address] = await client.requestAddresses()
      set({walletAddress: address})
      set({walletStatus: WalletStatus.connected })
      set({walletClient: client})

      // TODO register with auth service to get jwt token

    } catch (error) {
      console.error(error);
      set({walletStatus: WalletStatus.disconnected })
    }
  },
  walletStatus: WalletStatus.disconnected,
  walletAddress: '',
});