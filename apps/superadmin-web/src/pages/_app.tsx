import "../styles/globals.css";
import type { AppType } from "next/app";

import { Toaster } from "@/components/ui/toaster";

import { api } from "@/lib/utils/api";

const MyApp: AppType<{}> = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
};

export default api.withTRPC(MyApp);
