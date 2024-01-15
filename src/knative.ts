import k8s from "@kubernetes/client-node";

type Service = {
  name: string;
  image: string;
  port: number;
};

export class Knative {
  kubeconfig: k8s.KubeConfig;
  customObjectsApi: k8s.CustomObjectsApi;

  constructor(kubeconfig: k8s.KubeConfig) {
    this.kubeconfig = kubeconfig;
    this.customObjectsApi = this.kubeconfig.makeApiClient(k8s.CustomObjectsApi);
  }

  async getServices() {
    const { body } = await this.customObjectsApi.listNamespacedCustomObject(
      "serving.knative.dev",
      "v1",
      "adb-sh",
      "services",
    );
    return {
      services: body?.items,
    };
  }

  async createService(service: Service) {
    const { body } = await this.customObjectsApi.createNamespacedCustomObject(
      "serving.knative.dev",
      "v1",
      "adb-sh",
      "services",
      {
        apiVersion: "serving.knative.dev/v1",
        kind: "Service",
        metadata: {
          name: service.name,
          namespace: "adb-sh",
        },
        spec: {
          template: {
            metadata: {
              annotations: {
                //"autoscaling.knative.dev/min-scale": "1",
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
                      port: 0,
                    },
                  },
                  resources: {},
                },
              ],
              enableServiceLinks: false,
              timeoutSeconds: 300,
            },
          },
        },
      },
    );
    return body;
  }

  async deleteService(name: string) {
    const { body } = await this.customObjectsApi.deleteNamespacedCustomObject(
      "serving.knative.dev",
      "v1",
      "adb-sh",
      "services",
      name,
    );
    return body;
  }
}
