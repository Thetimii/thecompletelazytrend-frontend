// Script to check existing tables in Supabase
// Run this with Node.js to see what tables are available

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://cxtystgaxoeygwbvgqcg.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dHlzdGdheG9leWd3YnZncWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MjgzNTcsImV4cCI6MjA1ODQwNDM1N30.T3VfyJR2s5Qe-3KXdtwdQsA_0BfW0raViE0t2X6ijN4';

const curlCommand = `curl -X GET "${supabaseUrl}/rest/v1/?apikey=${supabaseKey}" \\
  -H "apikey: ${supabaseKey}" \\
  -H "Authorization: Bearer ${supabaseKey}"`;

console.log('Run this command to check available tables:');
console.log(curlCommand);
