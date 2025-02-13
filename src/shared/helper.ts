import crypto from "crypto";
import env from "./configs/env";

export async function randId() {
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  return randomBytes.toString("hex");
}

const IV = crypto.randomBytes(16);

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(env.SESSION_SECRET_KEY, "base64"),
    IV
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${IV.toString("hex")}.${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, encrypted] = encryptedText.split(".");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(env.SESSION_SECRET_KEY, "base64"),
    iv
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export function generateOTP(props?: { digits?: number } | undefined) {
  if (props && props.digits && props.digits <= 0)
    throw new Error("Digits must be a positive integer");
  return Array.from({ length: props?.digits || 6 })
    .map(() => Math.floor(Math.random() * 10))
    .join("");
}
