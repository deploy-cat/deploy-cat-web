import k8s from "@kubernetes/client-node";
import { Knative } from "./knative";
import { config } from "./config";

const kc = new k8s.KubeConfig();
if (config.kubeconfig?.path) {
  console.log("load kubeconfig from file");
  kc.loadFromFile(config.kubeconfig.path);
} else if (config.kubeconfig?.base64) {
  console.log("load kubeconfig from env (base64 encoded)");
  kc.loadFromString(atob(config.kubeconfig?.base64));
} else if (config.kubeconfig?.fromcluster) {
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
