import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fa8231",
    },
    secondary: {
      main: "#3867d6",
    },
    background: {
      default: "#121212",
      paper: "#1f1f1f",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans JP", sans-serif',
  },
});
