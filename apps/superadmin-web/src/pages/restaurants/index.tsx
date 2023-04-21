import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { ContentToContainer } from "@/components/layout/content-to-container";
import { MainContainer } from "@/components/layout/main-container";
import { SiteHeader } from "@/components/site-header";

import { UI_CONFIG } from "@/lib/config";

const RestaurantsPage: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`Restaurants - ${UI_CONFIG.company_name}`}</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>
      <MainContainer>
        <SiteHeader pathname={router.pathname} />
        <ContentToContainer>
          <p>This is the restaurants page 😊</p>
        </ContentToContainer>
      </MainContainer>
    </>
  );
};

export default RestaurantsPage;