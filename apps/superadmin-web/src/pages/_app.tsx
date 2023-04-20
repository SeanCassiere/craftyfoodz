import "../styles/globals.css";
import type { AppType } from "next/app";

import { api } from "@/lib/utils/api";

const MyApp: AppType<{}> = ({ Component, pageProps: { ...pageProps } }) => {
  return <Component {...pageProps} />;
};

export default api.withTRPC(MyApp);
