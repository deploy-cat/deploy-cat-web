import { A, Title } from "solid-start";
import LoginForm from "~/components/LoginForm";

export const Home = () => (
  <main>
    <Title>Login</Title>
    <section>
      <h1 class="text-6xl uppercase text-center my-12">Login</h1>
      <div class="flex justify-center">
        <LoginForm />
      </div>
    </section>
  </main>
);

export default Home;
