import { createClient } from "@supabase/supabase-js";

// 🔹 Replace with your actual Supabase keys
const SUPABASE_URL = "https://vhnthvvekwnnqpbsylke.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobnRodnZla3dubnFwYnN5bGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NjYzMzUsImV4cCI6MjA1ODQ0MjMzNX0.xy_eKZ8aim_bbohIjVXpDBUjoehnfP0P6cKSWmR_Cao";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
