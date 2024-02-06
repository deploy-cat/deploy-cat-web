import k8s from "@kubernetes/client-node";

type Service = {
  name: string;
  image: string;
  port: number;
  cpuLimit: string;
  memoryLimit: string;
  minScale: number;
  maxRequests: number;
};

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
      services: body?.items,
    };
  }

  async createService(service: Service, namespace: string) {
    console.log(namespace);
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
