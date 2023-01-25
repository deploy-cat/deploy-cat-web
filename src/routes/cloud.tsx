import Protected from "~/components/Protected";
import { Outlet, Title } from "solid-start";
import SideBar from "~/components/cloud/SideBar";

export const { routeData, Page } = Protected(({ user }) => {
  return (
    <main>
      <Title>Cloud</Title>
      <h1 class="text-3xl uppercase font-light m-4">Cloud</h1>
      <section class="flex">
        <SideBar />
        <Outlet />
      </section>
    </main>
  );
});

export default Page;
