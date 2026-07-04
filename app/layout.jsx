import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Plantify",
  description: "Plants, flowers, and gardening essentials.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}