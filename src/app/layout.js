"use client";
import { Inter } from "next/font/google";
import ThemeRegistry from "@/app/ThemeRegistry";
import { lightTheme, darkTheme } from "@/app/theme";
const inter = Inter({ subsets: ["latin"] });
import ContextWrapper from "./components/ContextWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <ThemeRegistry>
          <ContextWrapper>{children}</ContextWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
