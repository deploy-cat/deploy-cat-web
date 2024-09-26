import { createServerAction$, redirect } from "solid-start/server";
import { k8sCustomObjects } from "~/lib/k8s";
import { knative } from "~/lib/k8s";
import { JSXElement, Show } from "solid-js";
import { createStore } from "solid-js/store";

export const RegisterServerAction = (cb) => ({ children }) => {
  const [enrolling, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
      const data = Object.fromEntries(form.entries());
      console.log(modalStore);
      modalStore.callback?.(data);

      console.log(data);
    },
  );

  return (
    <div>
      <Form>
        <Show when={modalStore?.element}>{modalStore.element}</Show>
        {children}
      </Form>
    </div>
  );
};
2