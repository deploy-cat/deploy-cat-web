import { createSignal, Show, For } from "solid-js";
import { cache, createAsync } from "@solidjs/router";
import { getAccount } from "~/lib/auth";
import { Octokit } from "@octokit/rest";

const getPackages = cache(async () => {
  "use server";
  const account = await getAccount();
  const ok = new Octokit({
    auth: account.access_token,
  });
  try {
    const { data: packages } =
      await ok.packages.listPackagesForAuthenticatedUser({
        package_type: "container",
      });
    const packagesWithVersions = Promise.all(
      packages.map(async (pkg) => {
        const { data: versions } =
          await ok.packages.getAllPackageVersionsForPackageOwnedByAuthenticatedUser(
            {
              package_type: "container",
              package_name: pkg.name,
            }
          );
        const tags = versions.reduce((acc, version) => {
          version.metadata?.container?.tags.forEach((tag) => {
            if (!acc.includes(tag)) acc.push(tag);
          });
          return acc;
        }, [] as Array<any>);
        return { ...pkg, versions, tags };
      })
    );
    return packagesWithVersions;
  } catch (e) {
    console.log(e);
  }
}, "user-gh-packages");

type Source = "manual" | "ghcr";

const sourceOptions = [
  { name: "Public Image", slug: "manual" },
  { name: "GitHub Container Registry", slug: "ghcr" },
] as Array<{ name: string; slug: Source }>;

export const SourceInput = ({ data }) => {
  const [source, setSource] = createSignal("manual" as Source);
  const packages = createAsync(() => getPackages());
  const [pkg, setPkg] = createSignal(null as null | number);

  return (
    <>
      <div class="flex flex-col outline outline-1 rounded-xl my-4 px-4 py-2">
        <p>Source</p>
        <For each={sourceOptions}>
          {({ name, slug }) => (
            <div class="form-control">
              <label class="label cursor-pointer">
                <input
                  type="radio"
                  name="source"
                  value={slug}
                  class="radio"
                  checked={source() === slug}
                  onchange={(e) => setSource(slug)}
                />
                <span class="label-text">{name}</span>
              </label>
            </div>
          )}
        </For>
      </div>
      <Show when={source() === "manual"}>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Image</span>
          </div>
          <input
            type="text"
            name="image"
            required
            placeholder="traefik/whoami"
            class="input input-bordered w-full"
          />
        </label>
      </Show>
      <Show when={source() === "ghcr"}>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Container Image</span>
          </div>
          <select
            name="ghPackage"
            class="select select-bordered w-full"
            onchange={(e) => setPkg(Number(e.target.value))}
          >
            <For each={packages()}>
              {(p) => (
                <option value={p.id}>
                  {p.name} ({p.repository?.full_name})
                </option>
              )}
            </For>
          </select>
          <input
            type="hidden"
            name="ghPackageName"
            value={packages()?.find((p) => p.id === pkg())?.name}
          />
          <input
            type="hidden"
            name="ghPackageOwner"
            value={packages()?.find((p) => p.id === pkg())?.owner?.login}
          />
          <select name="ghPackageTag" class="select select-bordered w-full">
            <For each={packages()?.find((p) => p.id === pkg())?.tags}>
              {(t) => <option value={t}>{t}</option>}
            </For>
          </select>
        </label>
      </Show>
    </>
  );
};
