import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let cached: SupabaseClient<any, any> | null = null;

function createSupabaseClient(): SupabaseClient<any, any> {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel project settings."
    );
  }
  return createClient(supabaseUrl, supabasePublishableKey);
}

function getClient(): SupabaseClient<any, any> {
  if (!cached) {
    cached = createSupabaseClient();
  }
  return cached;
}

export const supabase = new Proxy(
  {} as Record<string, unknown>,
  {
    get(_target, prop) {
      const client = getClient();
      const value = Reflect.get(client, prop);
      if (typeof value === "function") return value.bind(client);
      return value;
    }
  }
) as unknown as SupabaseClient<any, any>;
