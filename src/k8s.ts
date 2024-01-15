import k8s from "@kubernetes/client-node";
import { Knative } from "./knative";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
// kc.loadFromCluster();

export const k8sCore = kc.makeApiClient(k8s.CoreV1Api);
export const k8sApiExtensions = kc.makeApiClient(k8s.ApiextensionsV1Api);
export const k8sCustomObjects = kc.makeApiClient(k8s.CustomObjectsApi);

export const knative = new Knative(kc);
