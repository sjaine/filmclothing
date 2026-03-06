import type { Metadata } from "next";
import { Instrument_Serif, Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: '400',
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  weight: '400',
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "FILMSCLOTHING.ONE",
  description: "My personal film record",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${instrumentSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
