const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!apiUrl || !supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing frontend environment variables for API or Supabase.");
}

export const env = {
  apiUrl,
  supabaseUrl,
  supabaseAnonKey,
};
