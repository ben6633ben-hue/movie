"use strict";

const path = require("path");
const fs = require("fs");

// Load .env.local first, then .env (same order as Next.js)
const envLocal = path.join(process.cwd(), ".env.local");
const env = path.join(process.cwd(), ".env");
if (fs.existsSync(envLocal)) require("dotenv").config({ path: envLocal });
if (fs.existsSync(env)) require("dotenv").config({ path: env });

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const missing = required.filter((key) => {
  const v = process.env[key];
  return !v || (typeof v === "string" && v.trim() === "");
});

if (missing.length > 0) {
  console.error("Missing required environment variables for build:");
  missing.forEach((key) => console.error("  - " + key));
  console.error("\nCopy .env.example to .env.local and set the values.");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
try {
  new URL(url);
} catch {
  console.error("NEXT_PUBLIC_SUPABASE_URL is not a valid URL:", url);
  process.exit(1);
}

console.log("Environment variables OK for build.");
