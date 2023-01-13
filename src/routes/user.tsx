import Protected from "~/components/Protected";

export const { routeData, Page } = Protected(({ user }) => {
  return (
    <main class="flex flex-col gap-2 items-center">
      <h1>This is a proteced route</h1>
      <img src={user.image} alt="`" />
      <p>{user.email}</p>
      <p>{user.name}</p>
    </main>
  );
});

export default Page;
