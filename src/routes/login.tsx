import { A, Title } from "solid-start";
import { signIn } from "@auth/solid-start/client";

export const Home = () => (
  <main>
    <Title>Login</Title>
    <section>
      <h1 class="text-6xl uppercase">Login</h1>
      <div class="flex justify-center">
        <button class="btn btn-primary" onClick={() => signIn("github")}>GitHub login</button>
      </div>
    </section>
  </main>
);

export default Home;
