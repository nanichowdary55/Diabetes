// const crypto = require("crypto");
import crypto from 'crypto';

const codeVerifier = "1234567891234567891234567891234567891234567";
console.log(`Length:${codeVerifier.length}`);
const codeChallenge = crypto
  .createHash("sha256")
  .update(codeVerifier)
  .digest("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/, "");

console.log("CODE_VERIFIER:");
console.log(codeVerifier);

console.log("\nCODE_CHALLENGE:");
console.log(codeChallenge);
// Venkey
// FD_S-6E0N6huN0lnG2thwnDSdYFBzGzxjPSZ2u8EW1U
// TEGzXG7QTl8jKBzRpMm4gpfVau5wLu