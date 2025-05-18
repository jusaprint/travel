import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Verify the user's JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Parse the request body
    const { endpoint, subscriber_id } = await req.json();

    if (!endpoint || !subscriber_id) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: endpoint and subscriber_id are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Define the base URL for the API
    const baseUrl = "https://kudo-backend-5tbuztsmmq-ey.a.run.app/partner";
    
    // Determine which endpoint to call
    let apiUrl;
    if (endpoint === "esim-status") {
      apiUrl = `${baseUrl}/esim-status`;
    } else if (endpoint === "subscriber-details") {
      apiUrl = `${baseUrl}/subscriber`;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid endpoint. Must be either 'esim-status' or 'subscriber-details'" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Make the API request
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any required API authentication headers here
        // "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({ subscriber_id }),
    });

    // Check if the API request was successful
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({ message: "Unknown error occurred" }));
      return new Response(
        JSON.stringify({ 
          error: errorData.message || `API request failed with status ${apiResponse.status}`,
          status: apiResponse.status
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: apiResponse.status,
        }
      );
    }

    // Get the response data
    const data = await apiResponse.json();

    // Return the response
    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    
    // Handle any errors
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});