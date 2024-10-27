import k8s from "@kubernetes/client-node";

export type Service = {
  name: string;
  image: string;
  port: number;
  resources: {
    cpuLimit: number;
    memoryLimit: number;
  };
  scaling: {
    minScale: number;
    maxRequests: number;
  };
  envVars: { [key: string]: string };
  raw?: any;
};

export const toNumber = (value: any) => value && Number(value);

const toKnService = (service: any) =>
  ({
    name: service.metadata.name,
    image: service.spec.template.spec.containers[0].image,
    port: service.spec.template.spec.containers[0].ports[0].containerPort,
    resources: {
      cpuLimit: toNumber(
        service.spec.template.spec.containers[0].resources.limits?.cpu.replace(
          "m",
          ""
        )
      ),
      memoryLimit: toNumber(
        service.spec.template.spec.containers[0].resources.limits?.memory.replace(
          "Mi",
          ""
        )
      ),
    },
    scaling: {
      minScale: toNumber(
        service.spec.template.metadata.annotations[
          "autoscaling.knative.dev/min-scale"
        ]
      ),
      maxRequests: toNumber(
        service.spec.template.metadata.annotations[
          "autoscaling.knative.dev/target"
        ]
      ),
    },
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

  async getRevisions(name: string, namespace: string) {
    const { body } = await this.customObjectsApi.listNamespacedCustomObject(
      "serving.knative.dev",
      "v1",
      namespace,
      "revisions",
      undefined,
      undefined,
      undefined,
      undefined,
      `serving.knative.dev/configuration=${name}`
    );
    return body.items;
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
          labels: {
            "app.kubernetes.io/managed-by": "deploycat",
          },
        },
        spec: {
          template: {
            metadata: {
              annotations: {
                "autoscaling.knative.dev/initial-scale": "1",
                "autoscaling.knative.dev/min-scale":
                  service.scaling.minScale &&
                  service.scaling.minScale.toString(),
                "autoscaling.knative.dev/target":
                  service.scaling.maxRequests &&
                  service.scaling.maxRequests.toString(),
                "autoscaling.knative.dev/metric": "rps",
              },
              labels: {
                "apps.deploycat.io/source": "manual",
              },
            },
            spec: {
              imagePullSecrets:
                (service.pullSecret && [
                  {
                    name: service.pullSecret,
                  },
                ]) ||
                null,
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
                      cpu:
                        service.resources.cpuLimit &&
                        `${service.resources.cpuLimit.toString()}m`,
                      memory:
                        service.resources.memoryLimit &&
                        `${service.resources.memoryLimit.toString()}Mi`,
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

  async updateService(name: string, service: Service, namespace: string) {
    const currentService = await this.getService(name, namespace);

    const { body } = await this.customObjectsApi.replaceNamespacedCustomObject(
      "serving.knative.dev",
      "v1",
      namespace,
      "services",
      name,
      {
        apiVersion: "serving.knative.dev/v1",
        kind: "Service",
        metadata: {
          name: service.name,
          namespace: namespace,
          labels: {
            "app.kubernetes.io/managed-by": "deploycat",
          },
          annotations: {
            ...currentService.raw.metadata.annotations,
          },
          resourceVersion: currentService.raw.metadata.resourceVersion,
        },
        spec: {
          template: {
            metadata: {
              annotations: {
                "autoscaling.knative.dev/initial-scale": "1",
                "autoscaling.knative.dev/min-scale":
                  service.scaling.minScale &&
                  service.scaling.minScale.toString(),
                "autoscaling.knative.dev/target":
                  service.scaling.maxRequests &&
                  service.scaling.maxRequests.toString(),
                "autoscaling.knative.dev/metric": "rps",
              },
              labels: {
                "apps.deploycat.io/source": "manual",
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
                      cpu:
                        service.resources.cpuLimit &&
                        `${service.resources.cpuLimit.toString()}m`,
                      memory:
                        service.resources.memoryLimit &&
                        `${service.resources.memoryLimit.toString()}Mi`,
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
