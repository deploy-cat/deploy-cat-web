import { A } from "@solidjs/router";
import { Show } from "solid-js";
import LoginForm from "~/components/LoginForm";

export default () => {
  // const session = useRouteData<typeof useSession>();

  return (
    <main class="m-0">
      <title>Register</title>
      <section class="grow w-2/5">
        <h1 class="text-6xl uppercase text-center my-12">Register</h1>
        <div class="flex justify-center">
          {/* <LoginForm /> */}
        </div>
      </section>
    </main>
  );
};
