import type { User } from "~/lib/auth";

export const UserBadge = ({ user }: { user: User }) => {
  return (
    <div class="flex gap-4 bg-base-300 p-2 rounded-full">
      {user.image ? (
        <div class="avatar">
          <div class="w-12 rounded-full">
            <img src={user.image} />
          </div>
        </div>
      ) : (
        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content w-12 rounded-full">
            <span>{user.name.slice(0, 2)}</span>
          </div>
        </div>
      )}
      <div class="flex flex-col justify-center">
        <b>{user.name}</b>
        <span>{user.email}</span>
      </div>
    </div>
  );
};
