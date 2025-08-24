import crypto from "crypto"

export class GenerateOtp{
getOtp(length = 6): string {
  return Array.from(crypto.randomBytes(length))
    .map((byte) => (byte % 10).toString())
    .join("");
}
}