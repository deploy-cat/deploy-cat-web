import k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const k8sCore = kc.makeApiClient(k8s.CoreV1Api);
export const k8sApiExtensions = kc.makeApiClient(k8s.ApiextensionsV1Api);
export const k8sCustomObjects = kc.makeApiClient(k8s.CustomObjectsApi);
