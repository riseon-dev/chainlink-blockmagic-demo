import Orderbook from './components/orderbook/orderbook.tsx';
import PlaceOrderWidget from './components/place-order-widget/place-order-widget.tsx';
import { Box, CssBaseline, Grid, ThemeProvider } from '@mui/material';
import { theme } from './theme.ts';
import ApplicationBar from "./components/app-bar/app-bar.tsx";
import Web3ConnectButton from "./components/web3-connect/web3-connect-button.tsx";

function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* The rest of your application */}
        <ApplicationBar><Web3ConnectButton /></ApplicationBar>

          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh' }}
          >
            <Grid item xs={3}>
              <Box sx={{
                display: 'grid',
                gridTemplateRows: 'repeat(2, 1fr)'
              }}>
                <Orderbook />
                <PlaceOrderWidget />
              </Box>
            </Grid>
          </Grid>


      </ThemeProvider>
  )
}

export default App
