// supabaseClient.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = 'https://zogwvqnpiodjcowivlkq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ3d2cW5waW9kamNvd2l2bGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcwOTQ0MjcsImV4cCI6MjA0MjY3MDQyN30.mUejuDrGo1e07z3euQYfwrx0AC5TfnFENNhlUbdkf80';

const supabase = createClientComponentClient({
  supabaseUrl,
  supabaseKey,
});

export default supabase;
