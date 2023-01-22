const apps = [
  { name: "Hello World", host: "helloworld.deploy.cat", image: "traefik/whoami" },
  { name: "Hello World", host: "helloworld.deploy.cat", image: "traefik/whoami" },
  { name: "Hello World", host: "helloworld.deploy.cat", image: "traefik/whoami" },
  { name: "Hello World", host: "helloworld.deploy.cat", image: "traefik/whoami" },
  { name: "Hello World", host: "helloworld.deploy.cat", image: "traefik/whoami" },
  { name: "Hello World", host: "helloworld.deploy.cat", image: "traefik/whoami" },
];

export const Page = () => (
  <section class="grid md:grid-cols-3 w-full m-0">
    {
      apps.map(app => (
        <figure
          class="card basis-64 grow p-6 m-3 dark:hover:shadow-2xl transition-all duration-100 cursor-pointer">
          <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{app.name}</h2>
          <p class="font-normal text-gray-700 dark:text-gray-400 my-1">{app.host}</p>
          <p class="font-normal text-gray-700 dark:text-gray-400 my-1">{app.image}</p>
        </figure>
      ))
    }
    <button
      class="block max-w-sm p-6 m-3 card text-center outline-dashed outline-stone-400 dark:bg-slate-200/10 dark:hover:shadow-2xl transition-all duration-100">
      <span class="text-3xl text-slate-400">+</span>
    </button>
  </section>
);

export default Page;
