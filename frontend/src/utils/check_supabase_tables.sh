#!/bin/bash

# Supabase URL and key from the frontend code
SUPABASE_URL="https://cxtystgaxoeygwbvgqcg.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dHlzdGdheG9leWd3YnZncWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MjgzNTcsImV4cCI6MjA1ODQwNDM1N30.T3VfyJR2s5Qe-3KXdtwdQsA_0BfW0raViE0t2X6ijN4"

# Get list of tables
echo "Fetching list of tables..."
curl -s -X GET \
  "$SUPABASE_URL/rest/v1/?apikey=$SUPABASE_KEY" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY"

# Get schema information for information_schema.tables
echo -e "\n\nFetching detailed schema information..."
curl -s -X GET \
  "$SUPABASE_URL/rest/v1/information_schema/tables?select=table_name,table_schema&apikey=$SUPABASE_KEY" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Range: 0-100"

# Check if users table exists
echo -e "\n\nChecking for users table..."
curl -s -X GET \
  "$SUPABASE_URL/rest/v1/users?select=*&limit=1&apikey=$SUPABASE_KEY" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY"
