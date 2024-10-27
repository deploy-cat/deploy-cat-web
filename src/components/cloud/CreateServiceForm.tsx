import { Show } from "solid-js";
import { action, redirect, useSubmission } from "@solidjs/router";
import { knative } from "~/lib/k8s";
import { EnvVarsInput } from "../EnvVarsInput";
import { ScalingInput } from "../ScalingInput";
import { ResourcesInput } from "../ResourcesInput";
import { getUser, getAccount } from "~/lib/auth";
import type { Service } from "~/lib/knative";
import { toNumber } from "~/lib/knative";
import { SourceInput } from "./service/SourceInput";
import { k8sCore } from "~/lib/k8s";

const ensureGithubPullSecret = async (namespace: string) => {
  "use server";
  const secretName = "pull-secret-ghcr";
  try {
    await k8sCore.readNamespacedSecret(secretName, namespace);
  } catch (e) {
    const user = await getUser();
    const accout = await getAccount();

    const username = user.name;
    const token = accout.access_token;
    const email = user.email;

    await k8sCore.createNamespacedSecret(namespace, {
      apiVersion: "v1",
      kind: "Secret",
      metadata: {
        name: secretName,
        labels: {
          "app.kubernetes.io/managed-by": "deploycat",
        },
      },
      type: "kubernetes.io/dockerconfigjson",
      data: {
        ".dockerconfigjson": Buffer.from(
          JSON.stringify({
            auths: {
              "ghcr.io": {
                username: username,
                password: token,
                email: email,
                auth: Buffer.from(`${username}:${token}`).toString("base64"),
              },
            },
          })
        ).toString("base64"),
      },
    });
  }
};

const createServiceFromForm = async (form: FormData) => {
  "use server";
  const service = {
    name: form.get("name") as string,
    source: form.get("source") as string,
    image: form.get("image") as string,
    ghPackage: form.get("ghPackage") as string,
    ghPackageTag: form.get("ghPackageTag") as string,
    ghPackageName: form.get("ghPackageName") as string,
    ghPackageOwner: form.get("ghPackageOwner") as string,
    port: Number(form.get("port")) as number,
    resources: {
      cpuLimit: toNumber(form.get("cpuLimit")),
      memoryLimit: toNumber(form.get("memoryLimit")),
    },
    scaling: {
      minScale: toNumber(form.get("minScale")),
      maxRequests: toNumber(form.get("maxRequests")),
    },
    envVars: JSON.parse(form.get("env") as string) as { [key: string]: string },
  } as Service;
  const user = await getUser();
  if (service?.source === "ghcr") {
    try {
      await ensureGithubPullSecret(user.name);
    } catch (e) {
      console.error(e);
    }
    service.image = `ghcr.io/${service.ghPackageOwner}/${service.ghPackageName}:${service.ghPackageTag}`;
    service.pullSecret = "pull-secret-ghcr";
  }
  try {
    await knative.createService(service, user.name);
  } catch (e) {
    console.error(e);
  }
};

const createServiceAction = action(createServiceFromForm, "createService");

export const CreateServiceForm = () => {
  const createServiceStatus = useSubmission(createServiceAction);

  return (
    <dialog id="create-service-modal" class="modal">
      <div class="modal-box">
        <form action={createServiceAction} method="post">
          <h3 class="font-bold text-lg">Deploy new App</h3>
          <div class="collapse collapse-arrow bg-base-200 my-2">
            <input type="radio" name="my-accordion-2" checked={true} />
            <div class="collapse-title text-xl font-medium">General</div>
            <div class="collapse-content">
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">Name</span>
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="my-app"
                  class="input input-bordered w-full"
                />
              </label>
              <SourceInput />

              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">Port</span>
                </div>
                <input
                  type="number"
                  name="port"
                  required
                  placeholder="80"
                  class="input input-bordered w-full"
                />
              </label>
            </div>
          </div>
          <div class="collapse collapse-arrow bg-base-200 my-2">
            <input type="radio" name="my-accordion-2" />
            <div class="collapse-title text-xl font-medium">Environment</div>
            <div class="collapse-content">
              <EnvVarsInput />
            </div>
          </div>
          <div class="collapse collapse-arrow bg-base-200 my-2">
            <input type="radio" name="my-accordion-2" />
            <div class="collapse-title text-xl font-medium">Resources</div>
            <div class="collapse-content">
              <ResourcesInput />
            </div>
          </div>
          <div class="collapse collapse-arrow bg-base-200 my-2">
            <input type="radio" name="my-accordion-2" />
            <div class="collapse-title text-xl font-medium">Scaling</div>
            <div class="collapse-content">
              <ScalingInput />
            </div>
          </div>
          <button type="submit" id="submitForm" class="hidden" />
        </form>
        <div class="modal-action">
          <form method="dialog">
            <button id="closeDialog" class="btn">
              Close
            </button>
          </form>
          <label for="submitForm" tabindex={0} class="btn btn-primary">
            <Show when={createServiceStatus.pending}>
              <span class="loading loading-spinner"></span>
            </Show>
            Deploy
          </label>
        </div>
      </div>
    </dialog>
  );
};
