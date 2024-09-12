import { For, Show } from "solid-js";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@deploy-cat/heroicons-solid/24/solid/esm";

export const StatusBadge = ({ conditions }) => {
  const status = !conditions.some((condition) => condition.stats === "False");

  return status ? (
    <CheckCircleIcon class=" w-6 h-6 text-success" />
  ) : (
    <ExclamationCircleIcon class=" w-6 h-6 text-success" />
  );
};
