import { createTheme } from '@mui/material';
import { PaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface Theme {
    palette: {
      mode: string;
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    palette?: PaletteOptions
  }
}
export const theme = createTheme({
  palette: {
    mode: 'dark',
  }
});


