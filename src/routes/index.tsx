import { Title } from "solid-start";
import { A } from "solid-start";

export const Home = () => (
  <main>
    <Title>deploy.cat</Title>
    <section>
      <h1 class="text-6xl text-sky-400 uppercase">deploy.cat</h1>
      <p class="text-xl font-light">deploy your apps in just a few minutes</p>
      <div class="flex justify-center">
        <A href="/login" class="btn btn-primary">Get Started</A>
      </div>
    </section>
  </main>
);

export default Home;
