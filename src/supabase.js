import { createClient } from '@supabase/supabase-js';

// Access environment variables using import.meta.env for Vite
// Fallback to hardcoded values for deployments without env vars configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hbunxjsfpugpmqwvyntz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhidW54anNmcHVncG1xd3Z5bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODEyODcsImV4cCI6MjEwMDY1NzI4N30.1Ggt9rUMaYVEWN60IFQJd2tGYW30d-_1sPKPIGdAG7Y';

export const supabase = createClient(supabaseUrl, supabaseKey);