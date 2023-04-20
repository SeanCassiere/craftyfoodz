import {
  JetBrains_Mono as FontMono,
  Inter as FontSans,
} from "next/font/google";

export const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
