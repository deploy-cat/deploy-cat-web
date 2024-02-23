import { Component, Show } from "solid-js";
import { useSupabase } from "solid-supabase";
import { useNavigate } from "@solidjs/router";
import { createAsync, cache } from "@solidjs/router";
import { k8sCore } from "~/k8s";
import { User } from "@supabase/supabase-js";

// const Protected = (Comp: IProtectedComponent) => {
//   const getSession = cache(async () => {
//     "use server";
//     const navigate = useNavigate();
//     const supabase = useSupabase();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     return user;
//   }, "user");

//   const route = {
//     load: () => getSession(),
//   };

//   return {
//     route,
//     Page: () => {
//       const session = createAsync(getSession);
//       return (
//         <Show when={session()} keyed>
//           {(props) => <Comp {...props} />}
//         </Show>
//       );
//     },
//   };
// };

// type IProtectedComponent = Component<User>;

// export default Protected;

// const Protected = () => {
//   const navigate = useNavigate();
//   const supabase = useSupabase();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) {
//     navigate("/login");
//     return;
//   }

//   return (
//     <Show when={session()} keyed>
//       {(props) => <Comp {...props} />}
//     </Show>
//   );
// };
