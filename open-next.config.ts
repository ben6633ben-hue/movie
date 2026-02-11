// No R2 required. Omit incrementalCache to use the default "dummy" cache (no bucket setup).
// For shared ISR across workers, use r2IncrementalCache or kvIncrementalCache and configure bindings.
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({});
