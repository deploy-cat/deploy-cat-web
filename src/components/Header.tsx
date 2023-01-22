import { A } from "solid-start";

export const Header = () => (
  <header class="sticky top-0 z-40 backdrop-blur bg-gray-900/75 border-b border-sky-800 p-2">
    <nav class="flex justify-between">
      <div class="flex">
        <A href="/" class="py-2 px-3 m-1 rounded-lg uppercase dark:hover:bg-slate-800">deploy.cat</A>
        <A href="/about" class="py-2 px-3 m-1 rounded-lg dark:hover:bg-slate-800">About</A>
        <A href="/cloud" class="py-2 px-3 m-1 rounded-lg dark:hover:bg-slate-800">Cloud</A>
        <A href="/docs" class="py-2 px-3 m-1 rounded-lg dark:hover:bg-slate-800">Docs</A>
      </div>
      <A href="/login" class="py-2 px-3 m-1 rounded-lg dark:hover:bg-slate-800">Login</A>
    </nav>
  </header>
);

export default Header;
