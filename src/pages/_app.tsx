import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { ThemeProvider } from "~/components/common/themeProvider";
import { Toaster } from "~/components/ui/toaster";

type Props = {
  Component: {
    (): JSX.Element;
    isProtected?: boolean;
    isInternal?: boolean;
    title?: string;
    layout: ({ children }: { children: JSX.Element }) => JSX.Element;
  };
  pageProps: { session: Session | null };
};

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: Props) => {
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Head>
          <title>{Component.title ?? "Rumin AI"}</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Toaster />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
