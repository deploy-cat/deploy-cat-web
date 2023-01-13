import { Title } from "solid-start";
import { signIn } from "@auth/solid-start/client";

export default function Home() {
  return (
    <main>
      <Title>Login</Title>
      <h1>Login</h1>
      <button onclick={() => signIn("github")}>GitHub login</button>
    </main>
  );
}
