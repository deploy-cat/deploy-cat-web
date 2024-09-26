import { For, Show } from "solid-js";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@deploy-cat/heroicons-solid/24/solid/esm";
import { Status } from "./Status";

export const StatusBadge = ({ conditions, disableDropdown = false }) => {
  const status =
    conditions.find((condition) => condition.type === "Ready").status ===
    "True";

  const renderedStatus = status ? (
    <CheckCircleIcon tabindex="0" role="button" class=" w-6 h-6 text-success" />
  ) : (
    <ExclamationCircleIcon
      tabindex="0"
      role="button"
      class=" w-6 h-6 text-error"
    />
  );

  return disableDropdown ? (
    renderedStatus
  ) : (
    <>
      <div class="dropdown">
        {renderedStatus}
        <div
          tabindex="0"
          class="dropdown-content menu bg-base-200 rounded-box z-[2] w-max p-2 shadow"
        >
          <Status conditions={conditions} />
        </div>
      </div>
    </>
  );
};
