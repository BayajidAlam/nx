export enum TAG_TYPES {
  GLOBAL = "global",
}

export const tagTypesList = Object.values(TAG_TYPES).filter(
  (value) => typeof value === "string"
);
