// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Use anon key for client-side
const supabaseUrl = 'https://ekfqurdhdfdfqatvgwwf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZnF1cmRoZGZkZnFhdHZnd3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMzkzNDMsImV4cCI6MjA4MDkxNTM0M30.KiRAEyJvyxXlQgQ_5VD8yc0LCV2rXesl2mLV3h1YNF0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Create a service role client for server-side use only
// This should NOT be exported to client components
const supabaseServiceRoleKey = 'your_service_role_key_here'; // Keep this secret!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});