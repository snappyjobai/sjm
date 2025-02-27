import { Roboto, Aclonica, Coda } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import Navbar from "../components/Navbar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const aclonica = Aclonica({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-aclonica",
});

const coda = Coda({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-coda",
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <div
        className={`${roboto.variable} ${aclonica.variable} ${coda.variable}`}
      >
        <Navbar />
        <main className="pt-16">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
}

export default MyApp;
