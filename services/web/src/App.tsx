import Orderbook from './components/orderbook/orderbook.tsx';
import PlaceOrderWidget from './components/place-order-widget/place-order-widget.tsx';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme.ts';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* The rest of your application */}

      <Orderbook />
      <PlaceOrderWidget />
    </ThemeProvider>
  )
}

export default App
