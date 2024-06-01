import React, {PropsWithChildren} from 'react';
import {AppBar, Divider, styled, Toolbar} from "@mui/material";

export type ApplicationBarProps = {
  children?: React.ReactNode;
  position?: string;
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: 'center',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  // Override media queries injected by theme.mixins.toolbar
  '@media all': {
    minHeight: 64,
  },
}));



function ApplicationBar(props: PropsWithChildren<ApplicationBarProps>) {
  return (
    <AppBar position="fixed">
      <StyledToolbar>
        Haru Exchange (Demo)
        <Divider />
        {props.children}
      </StyledToolbar>
    </AppBar>
  );
}

export default ApplicationBar;