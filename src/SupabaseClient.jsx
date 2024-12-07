import {createClient} from "@supabase/supabase-js";

const supabaseUrl = "https://xbqgjbcjbplvgiajmhhr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicWdqYmNqYnBsdmdpYWptaGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MjE5OTEsImV4cCI6MjA0Njk5Nzk5MX0.7Z5p3tcyMM2FfFetHXvd_eaOYVKq2LskAWwb7gWowSc";
export const supabase = createClient(supabaseUrl, supabaseKey);
