// @refresh reload
import { Suspense } from "solid-js";
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
import "./root.css";

export const Root = () => (
  <Html lang="en">
    <Head>
      <Title>deploy.cat</Title>
      <Meta charset="utf-8" />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <Body>
      <Suspense>
        <ErrorBoundary>
          <Header />
          <Routes>
            <FileRoutes />
          </Routes>
        </ErrorBoundary>
      </Suspense>
      <Scripts />
    </Body>
  </Html>
);

export default Root;
