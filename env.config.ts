import { adapters, config, validators } from "fatima";
import { z } from "zod";

const schema = z.object({
  CLERK_ENCRYPTION_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_WEBHOOK_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  NEXT_SERVER_APP_URL: z.string().url(),
  STRIPE_PRO_MONTHLY_PRICE_ID: z.string(),
  STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  UPLOADTHING_SECRET_KEY: z.string(),
  UPLOADTHING_TOKEN: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
  UPSTASH_REDIS_REST_URL: z.string().url(),
});

export default config({
  client: {
    publicPrefix: "NEXT_PUBLIC_",
  },
  environment: (processEnv) => processEnv.NODE_ENV ?? "development",
  load: {
    development: [adapters.local.load(".env")],
  },
  validate: validators.zod(schema),
});
