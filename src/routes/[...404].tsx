import { A } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";

export default () => (
  <main>
    <title>Not Found</title>
    <HttpStatusCode code={404} />
    <section>
      <h1 class="text-6xl uppercase text-center my-12">Page Not Found</h1>
      <img src="https://http.cat/404" alt="404" />
      <div class="flex justify-center">
        <A href="/" class="btn btn-primary">
          Go to Home
        </A>
      </div>
    </section>
  </main>
);
