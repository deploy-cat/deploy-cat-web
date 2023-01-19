import { A, Title } from "solid-start";
import { HttpStatusCode } from "solid-start/server";

export const NotFound = () => (
  <main>
    <Title>Not Found</Title>
    <HttpStatusCode code={404} />
    <section>
      <h1 class="text-6xl uppercase">Page Not Found</h1>
      <div class="flex justify-center">
        <A href="/login" class="btn btn-primary">Go to Home</A>
      </div>
    </section>
  </main>
);

export default NotFound;
