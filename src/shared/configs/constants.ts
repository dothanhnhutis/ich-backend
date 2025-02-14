export const permissions = [
  "read:role:id",
  "read:role:*",
  "write:role",
  "edit:role",
  "delete:role",

  "write:user",
  "read:user",
  "edit:user",
  "delete:user",

  "read:location:id",
  "read:location:*",
  "write:location",
  "edit:location",
  "delete:location",

  "write:room",
  "read:room:*",
  "read:room:id",
  "edit:room",
  "delete:room",

  // "write:clock:alarms",
  // "read:clock:alarms",
  // "update:clock:alarms",
  // "delete:clock:alarms",

  // "write:clock:timers",
  // "read:clock:timers",
  // "update:clock:timers",
  // "delete:clock:timers",

  "read:display:order:id",
  "read:display:order:*",
  "write:display:order",
  "update:display:order",
  "delete:display:order",

  "read:display:order:product:id",
  "read:display:order:product:*",
  "update:display:order:product",
  "delete:display:order:product",

  // "write:alarms",
  // "read:alarms",
  // "update:alarms",
  // "delete:alarms",

  "write:product",
  "read:product",
  "edit:product",
  "delete:product",
] as const;

export const pro_unit = ["CARTON", "PACKAGED_GOODS"] as const;

export const dateRegex =
  /^(0[1-9]|[12][0-9]|3[01])[-\/](0[1-9]|1[0-2])[-\/](\d{4})$/;
export const displayRegex =
  /^(createdAt|updatedAt|priority|enable)\.(asc|desc)$/;
export const trueFalseList: string[] = ["1", "0", "true", "false"];
export const alarmTimeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
export const timersTimeRegex = /^(?!0:00:00$)(\d|1\d|2[0-3]):[0-5]\d:[0-5]\d$/;

export const productRegex = /^(name|innerBoxQuantity)\.(asc|desc)$/;

export const CACHE_TTL = 3600;
