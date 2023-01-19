import { A } from "solid-start";

export const Header = () => (
  <header class="sticky top-0 z-40 backdrop-blur bg-gar-900/75 border-b border-sky-800 py-1">
    <nav class="flex justify-between">
      <div class="flex">
        <A href="/" class="btn uppercase">deploy.cat</A>
        <A href="/about" class="btn">About</A>
        <A href="/docs" class="btn">Docs</A>
      </div>
      <A href="/login" class="btn">Login</A>
    </nav>
  </header>
);

export default Header;
