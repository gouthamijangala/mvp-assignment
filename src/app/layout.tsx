import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Property Ops MVP",
  description: "Turn rentals into bookable listings",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
