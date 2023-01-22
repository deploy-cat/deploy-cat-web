import { A } from "@solidjs/router";

export const Page = () => (
  <section class="m-3 card flex justify-center items-center w-full">
    <div class="text-center">
      <h2 class="text-4xl">Cloud Panel</h2>
      <p>Welcome to your deploy.cat Cloud</p>
      <p>Manage your apps with ease</p>
      <A href="/cloud/dashboard" class="btn btn-primary">Dashboard</A>
    </div>
  </section>
);

export default Page;
