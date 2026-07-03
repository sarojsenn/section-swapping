import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://phekjsphmxcklqljqttt.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZWtqc3BobXhja2xxbGpxdHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMDEwMzEsImV4cCI6MjA5ODY3NzAzMX0.lz7Pc11aTs-RPtJp2jEudeYIRf2K8m9OFL5gr7nQ_Yw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
