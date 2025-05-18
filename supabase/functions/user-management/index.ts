import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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

    // Check if the user is an admin
    const { data: userData, error: userDataError } = await supabase
      .from("auth_users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userDataError) {
      return new Response(
        JSON.stringify({ error: "Failed to verify user role" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    if (userData.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Admin access required." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        }
      );
    }

    // Parse the request body
    const { action, userData: requestUserData } = await req.json();

    if (!action) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: action" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Handle different actions
    let responseData;
    let responseError;

    switch (action) {
      case "create":
        // Create a new user
        if (!requestUserData || !requestUserData.email || !requestUserData.password) {
          return new Response(
            JSON.stringify({ error: "Missing required user data" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            }
          );
        }

        // Create the user in Supabase Auth
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: requestUserData.email,
          password: requestUserData.password,
          email_confirm: true,
          user_metadata: {
            name: requestUserData.name || requestUserData.email
          }
        });

        if (createError) {
          responseError = createError;
          break;
        }

        // Update the user's role in auth_users table
        const { error: updateRoleError } = await supabase
          .from("auth_users")
          .update({ role: requestUserData.role || "user" })
          .eq("id", newUser.user.id);

        if (updateRoleError) {
          responseError = updateRoleError;
          break;
        }

        responseData = newUser;
        break;

      case "update":
        // Update an existing user
        if (!requestUserData || !requestUserData.id) {
          return new Response(
            JSON.stringify({ error: "Missing required user data" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            }
          );
        }

        // Update user metadata if name is provided
        if (requestUserData.name) {
          const { error: updateMetaError } = await supabase.auth.admin.updateUserById(
            requestUserData.id,
            { user_metadata: { name: requestUserData.name } }
          );

          if (updateMetaError) {
            responseError = updateMetaError;
            break;
          }
        }

        // Update password if provided
        if (requestUserData.password) {
          const { error: updatePassError } = await supabase.auth.admin.updateUserById(
            requestUserData.id,
            { password: requestUserData.password }
          );

          if (updatePassError) {
            responseError = updatePassError;
            break;
          }
        }

        // Update role in auth_users table
        if (requestUserData.role) {
          const { error: updateRoleError } = await supabase
            .from("auth_users")
            .update({ role: requestUserData.role, name: requestUserData.name })
            .eq("id", requestUserData.id);

          if (updateRoleError) {
            responseError = updateRoleError;
            break;
          }
        }

        responseData = { success: true, message: "User updated successfully" };
        break;

      case "delete":
        // Delete a user
        if (!requestUserData || !requestUserData.id) {
          return new Response(
            JSON.stringify({ error: "Missing required user data" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            }
          );
        }

        // Delete the user from Supabase Auth
        const { error: deleteError } = await supabase.auth.admin.deleteUser(
          requestUserData.id
        );

        if (deleteError) {
          responseError = deleteError;
          break;
        }

        responseData = { success: true, message: "User deleted successfully" };
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
    }

    if (responseError) {
      return new Response(
        JSON.stringify({ error: responseError.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify(responseData),
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