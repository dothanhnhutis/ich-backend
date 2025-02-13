export const permissions = [
  "write:roles",
  "read:roles",
  "update:roles",
  "delete:roles",

  "write:users",
  "read:users",
  "update:users",
  "delete:users",

  "write:factories",
  "read:factories",
  "update:factories",
  "delete:factories",

  "write:displays",
  "read:displays",
  "update:displays",
  "delete:displays",

  "write:clock:alarms",
  "read:clock:alarms",
  "update:clock:alarms",
  "delete:clock:alarms",

  "write:clock:timers",
  "read:clock:timers",
  "update:clock:timers",
  "delete:clock:timers",

  "write:departments",
  "read:departments",
  "update:departments",
  "delete:departments",

  "write:alarms",
  "read:alarms",
  "update:alarms",
  "delete:alarms",

  "write:products",
  "read:products",
  "update:products",
  "delete:products",
] as const;

export const dateRegex =
  /^(0[1-9]|[12][0-9]|3[01])[-\/](0[1-9]|1[0-2])[-\/](\d{4})$/;
export const displayRegex =
  /^(createdAt|updatedAt|priority|enable)\.(asc|desc)$/;
export const trueFalseList: string[] = ["1", "0", "true", "false"];
export const alarmTimeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
export const timersTimeRegex = /^(?!0:00:00$)(\d|1\d|2[0-3]):[0-5]\d:[0-5]\d$/;

export const productRegex = /^(name|innerBoxQuantity)\.(asc|desc)$/;

export const CACHE_TTL = 3600;
