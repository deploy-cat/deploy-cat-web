// @refresh reload
import { JSXElement, Show, Suspense } from "solid-js";
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import "./root.css";
import { SessionProvider } from "@solid-auth/base/client";
import { createStore } from "solid-js/store";
import { ModalWrapper } from "./components/ModalWrapper";

export const Root = () => (
  <Html lang="en">
    <Head>
      <Title>deploy.cat</Title>
      <Meta charset="utf-8" />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />

      <Meta
        name="description"
        content="deploy your app in just a few minutes"
      />
      <Meta
        name="keywords"
        content="deploy.cat, DeployCat, deploy, hosting, docker, devops, open source, FOSS"
      />
      <Meta name="robots" content="index, follow" />
      <Meta name="theme-color" content="#111827" />
      <Meta name="apple-mobile-web-app-capable" content="yes" />
      <Meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <Meta name="author" content="Alban David Becker" />
      <Meta name="publisher" content="Alban David Becker" />
      <Meta name="copyright" content="Alban David Becker" />
      <Meta name="page-type" content="Private Homepage" />
    </Head>
    <Body class="flex flex-col justify-between min-h-screen">
      <SessionProvider>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
            {/* <Show when={modalStore.modal}>{modalStore.modal}</Show> */}
            <ModalWrapper />
            <Footer />
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </SessionProvider>
    </Body>
  </Html>
);

export default Root;
