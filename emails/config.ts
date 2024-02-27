import { siteConfig } from "@/config/site";

export const APP_TITLE = siteConfig.name;

export const LOGO_SRC = "https://res.cloudinary.com/dimdlqjzv/image/upload/v1708820852/SNPClic/logo_500px.png";

export const TAILWIND_CONFIG = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
      colors: {
        primary: "#10a847",
        background: "#fafafa",
        foreground: "#262626",
        border: "#f5f5f5",
      },
    },
  },
}