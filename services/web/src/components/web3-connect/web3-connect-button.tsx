import {Button } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';
import {useBoundStore} from "../../stores/store.ts";
import {WalletStatus} from "../../stores/web3.slice.ts";
import {PropsWithChildren} from "react";

type ConnectButtonProps = {
  variant?: string;
  startIcon?: React.ReactNode;
  color?: string;
  sx?: object;
  children?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const ConnectButton = (props: PropsWithChildren<ConnectButtonProps>) => {
  return (
    <Button
      variant={"outlined"}
      startIcon={<CloudSyncOutlinedIcon />}
      color={"inherit"}
      sx={{
        justifyContent: "flex-end",
        marginLeft: "auto"
      }}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  )
}


function Web3ConnectButton() {
  const connectWallet = useBoundStore((state) => state.connectWallet);
  const walletStatus: WalletStatus = useBoundStore((state) => state.walletStatus);

  const ButtonComponent = walletStatus === WalletStatus.connecting ? LoadingButton : ConnectButton;

  return (
    <ButtonComponent
      {...(walletStatus === 'connected' ? {disabled: true} : {}) }
      onClick={connectWallet}
      >
      Connect
    </ButtonComponent>

  );
}

export default Web3ConnectButton;