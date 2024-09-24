import { createServerAction$, redirect } from "solid-start/server";
import { k8sCustomObjects } from "~/lib/k8s";
import { knative } from "~/lib/k8s";
import { JSXElement, Show } from "solid-js";
import { createStore } from "solid-js/store";

type ModalFlow = {
  element: null | JSXElement,
  callback: null | ((a: any) => any),
  close: null | ((a: any) => any),
};

export const [modalStore, setModalStore] = createStore({} as ModalFlow);

export const openModal = (
  el: JSXElement,
  cb = (() => true) as (a: any) => any,
) =>
  new Promise((res, rej) => {
    setModalStore({
      element: el,
      callback: async (data: any) => {
        await cb(data);
        setModalStore({});
        res(data);
      },
      close: rej,
    } as ModalFlow);
  });

export const ModalWrapper = () => {
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
      </Form>
    </div>
  );
};
