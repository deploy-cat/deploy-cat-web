import { A, Title } from "solid-start";

export const Home = () => (
  <main>
    <Title>deploy.cat</Title>
    <section>
      <div class="flex justify-center">
        <img src="/deploy.cat.png" alt="logo" class="rounded-xl w-40" />
      </div>
      <h1 class="text-6xl text-sky-400 uppercase text-center my-12">deploy.cat</h1>
      <p class="text-xl font-light text-center">
        deploy your apps in just a few minutes
      </p>
      <div class="flex justify-center">
        <A href="/login" class="btn btn-primary">Get Started</A>
      </div>
    </section>
  </main>
);

export default Home;
