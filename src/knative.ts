import k8s from "@kubernetes/client-node";

export type Service = {
  name: string;
  image: string;
  port: number;
  cpuLimit: string;
  memoryLimit: string;
  minScale: number;
  maxRequests: number;
  envVars: { [key: string]: string };
  raw?: any;
};

const toKnService = (service: any) =>
  ({
    name: service.metadata.name,
    image: service.spec.template.spec.containers[0].image,
    port: service.spec.template.spec.containers[0].ports[0].containerPort,
    cpuLimit: service.spec.template.spec.containers[0].resources.limits?.cpu,
    memoryLimit:
      service.spec.template.spec.containers[0].resources.limits?.memory,
    minScale:
      service.spec.template.metadata.annotations[
        "autoscaling.knative.dev/min-scale"
      ],
    maxRequests:
      service.spec.template.metadata.annotations[
        "autoscaling.knative.dev/target"
      ],
    envVars: Object.fromEntries(
      service.spec.template.spec.containers[0].env?.map(({ name, value }) => [
        name,
        value,
      ]) ?? []
    ),
    raw: service,
  } as Service);

export class Knative {
  kubeconfig: k8s.KubeConfig;
  customObjectsApi: k8s.CustomObjectsApi;

  constructor(kubeconfig: k8s.KubeConfig) {
    this.kubeconfig = kubeconfig;
    this.customObjectsApi = this.kubeconfig.makeApiClient(k8s.CustomObjectsApi);
  }

  async getServices(namespace: string) {
    const { body } = await this.customObjectsApi.listNamespacedCustomObject(
      "serving.knative.dev",
      "v1",
      namespace,
      "services"
    );
    return {
      services: body?.items.map(toKnService) as Array<Service>,
      raw: body,
    };
  }

  async getService(name: string, namespace: string) {
    const { body } = await this.customObjectsApi.getNamespacedCustomObject(
      "serving.knative.dev",
      "v1",
      namespace,
      "services",
      name
    );
    return toKnService(body);
  }

  async createService(service: Service, namespace: string) {
    const { body } = await this.customObjectsApi.createNamespacedCustomObject(
      "serving.knative.dev",
      "v1",
      namespace,
      "services",
      {
        apiVersion: "serving.knative.dev/v1",
        kind: "Service",
        metadata: {
          name: service.name,
          namespace: namespace,
        },
        spec: {
          template: {
            metadata: {
              annotations: {
                "autoscaling.knative.dev/initial-scale": "1",
                "autoscaling.knative.dev/min-scale":
                  service.minScale.toString(),
                "autoscaling.knative.dev/target":
                  service.maxRequests.toString(),
                "autoscaling.knative.dev/metric": "rps",
              },
            },
            spec: {
              containerConcurrency: 0,
              containers: [
                {
                  image: service.image,
                  name: "user-container",
                  ports: [
                    {
                      containerPort: service.port,
                      protocol: "TCP",
                    },
                  ],
                  readinessProbe: {
                    successThreshold: 1,
                    tcpSocket: {
                      port: service.port,
                    },
                  },
                  resources: {
                    limits: {
                      cpu: service.cpuLimit,
                      memory: service.memoryLimit,
                    },
                  },
                  env: Object.entries(service.envVars).map(([name, value]) => ({
                    name,
                    value,
                  })),
                },
              ],
              enableServiceLinks: false,
              timeoutSeconds: 300,
            },
          },
        },
      }
    );
    return body;
  }

  async deleteService(name: string, namespace: string) {
    const { body } = await this.customObjectsApi.deleteNamespacedCustomObject(
      "serving.knative.dev",
      "v1",
      namespace,
      "services",
      name
    );
    return body;
  }
}
