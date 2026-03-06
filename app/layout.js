import Navbar from "@/components/Navbar";
import {
  poppins,
  roboto_condensed,
  raleway,
  numans,
  montserrat,
  dm_sans,
} from "@/lib/font";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { SettingsProvider } from "@/context/SettingsContext";

export const metadata = {
  title: "ScanDine",
  description:
    "ScanDine is a smart QR-based self-ordering system for cafes and restaurants that lets customers browse menus, place orders, and pay instantly from their phones—no waiting in line, no hassle.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` ${poppins.variable} ${dm_sans.variable} ${raleway.variable} ${numans.variable} ${roboto_condensed.variable} ${montserrat.variable}`}
      >
        <SettingsProvider>
          <SessionWrapper>
            <Navbar />
            {children}
          </SessionWrapper>
        </SettingsProvider>
      </body>
    </html>
  );
}
