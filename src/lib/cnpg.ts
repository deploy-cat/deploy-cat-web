import k8s from "@kubernetes/client-node";
import type { Database } from "./types";

export class CNPG {
  kubeconfig: k8s.KubeConfig;
  customObjectsApi: k8s.CustomObjectsApi;

  constructor(kubeconfig: k8s.KubeConfig) {
    this.kubeconfig = kubeconfig;
    this.customObjectsApi = this.kubeconfig.makeApiClient(k8s.CustomObjectsApi);
  }

  async getDatabases(namespace: string) {
    const { body } = await this.customObjectsApi.listNamespacedCustomObject(
      "postgresql.cnpg.io",
      "v1",
      namespace,
      "clusters"
    );
    return body.items;
  }

  async getDatabase(name: string, namespace: string) {
    const { body } = await this.customObjectsApi.getNamespacedCustomObject(
      "postgresql.cnpg.io",
      "v1",
      namespace,
      "clusters",
      name
    );
    return body;
  }

  async createDatabase(db: Database, namespace: string) {
    const { body } = await this.customObjectsApi.createNamespacedCustomObject(
      "postgresql.cnpg.io",
      "v1",
      namespace,
      "clusters",
      {
        apiVersion: "postgresql.cnpg.io/v1",
        kind: "Cluster",
        metadata: {
          name: db.name,
          labels: {
            "app.kubernetes.io/managed-by": "deploycat",
          },
        },
        spec: {
          instances: db.instances ?? 3,
          bootstrap: {
            initdb: {
              database: db.init.database,
              owner: db.init.owner,
            },
          },
          storage: {
            storageClass: "longhorn",
            size: `${db.size}Gi`,
          },
        },
      }
    );
    return body;
  }

  async updateDatabase(name: string, db: Database, namespace: string) {
    const { body } = await this.customObjectsApi.patchNamespacedCustomObject(
      "postgresql.cnpg.io",
      "v1",
      namespace,
      "clusters",
      name,
      {
        spec: {
          instances: db.instances ?? 3,
          storage: {
            storageClass: "longhorn",
            size: `${db.size}Gi`,
          },
        },
      }
    );
    return body;
  }

  async deleteDatabase(name: string, namespace: string) {
    const { body } = await this.customObjectsApi.deleteNamespacedCustomObject(
      "postgresql.cnpg.io",
      "v1",
      namespace,
      "clusters",
      name
    );
    return body;
  }
}
