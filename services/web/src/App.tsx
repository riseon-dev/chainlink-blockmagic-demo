import Orderbook from './components/orderbook/orderbook.tsx';
import PlaceOrderWidget from './components/place-order-widget/place-order-widget.tsx';
import { Box, CssBaseline, Grid, ThemeProvider } from '@mui/material';
import { theme } from './theme.ts';

function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* The rest of your application */}
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
