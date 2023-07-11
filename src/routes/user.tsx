import Protected from "~/components/Protected";

export const { routeData, Page } = Protected(({ user }) => (
  <main class="flex flex-col gap-2 items-center">
    <img src={user.image} alt="`" />
    <p>{user.email}</p>
    <p>{JSON.stringify(user)}</p>
  </main>
));

export default Page;
