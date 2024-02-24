import k8s from "@kubernetes/client-node";
import { Knative } from "./knative";

const kc = new k8s.KubeConfig();
if (typeof process.env.DEPLOYCAT_KUBECONFIG_PATH === "string") {
  console.log("load kubeconfig from file");
  kc.loadFromFile(process.env.DEPLOYCAT_KUBECONFIG_PATH);
} else if (typeof process.env.DEPLOYCAT_KUBECONFIG === "string") {
  console.log("load kubeconfig from env (base64 encoded)");
  kc.loadFromString(atob(process.env.DEPLOYCAT_KUBECONFIG));
} else if (process.env.DEPLOYCAT_KUBECONFIG_FROM_CLUSTER) {
  console.log("load kubeconfig from cluster");
  kc.loadFromCluster();
} else {
  console.log("load kubeconfig from default");
  kc.loadFromDefault();
}

export const k8sCore = kc.makeApiClient(k8s.CoreV1Api);
export const k8sApiExtensions = kc.makeApiClient(k8s.ApiextensionsV1Api);
export const k8sCustomObjects = kc.makeApiClient(k8s.CustomObjectsApi);

export const knative = new Knative(kc);
