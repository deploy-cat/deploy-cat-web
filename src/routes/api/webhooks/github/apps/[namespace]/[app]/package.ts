import type { APIEvent } from "@solidjs/start/server";
import { knative } from "~/lib/k8s";
import { Webhooks } from "@octokit/webhooks";

export async function POST({ params, request }: APIEvent) {
  const { namespace, app } = params;
  const body = await request.text();

  const currentService = await knative.getService(app, namespace);
  const secret =
    currentService.raw.metadata.annotations["apps.deploycat.io/gh-webhook-secret"];

  const wh = new Webhooks({ secret });
  const signature = request.headers.get("x-hub-signature-256");
  if (!secret || !signature || !(await wh.verify(body, signature))) {
    return new Response("Not Authorized", { status: 403 });
  }

  const data = JSON.parse(body);
  if (
    data.action === "published" &&
    data.package?.package_version?.package_url === currentService.image
  ) {
    await knative.updateService(app, currentService, namespace, "ghcr");
    return new Response("Updated", { status: 200 });
  }
  return new Response("Not Found", { status: 404 });
}
