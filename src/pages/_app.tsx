import "../../public/assets/css/bootstrap.min.css";
import "../../public/assets/css//icofont.min.css";
import "../../public/assets/css/animate.css";
import "../../public/assets/css/lightcase.css";
import "../../public/assets/css/swiper-bundle.min.css";
import "../../public/assets/css/style.css";

import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import { NavBar } from "components/NavBar";
import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { WalletContextProvider } from "@mintbase-js/react/lib/WalletContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <WalletContextProvider>
        <Header />
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </WalletContextProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
