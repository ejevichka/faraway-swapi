import { type AppType } from "next/app";
import { Chakra_Petch } from "next/font/google";
import Layout from "./layout";

import "~/styles/globals.css";

const inter = Chakra_Petch({
  weight: "300",
  subsets: ["latin"],
  variable: "--font-sans",
});
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
      <main className={`font-sans ${inter.variable}`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
  );
};

export default MyApp;
