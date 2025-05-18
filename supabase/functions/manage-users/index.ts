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
      .from('auth_users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userDataError) {
      return new Response(
        JSON.stringify({ error: "Error fetching user data" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    if (userData.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Admin access required." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        }
      );
    }

    // Parse the request
    const { action, userData: targetUserData } = await req.json();

    // Handle different actions
    switch (action) {
      case 'create':
        return await createUser(supabase, targetUserData, corsHeaders);
      case 'update':
        return await updateUser(supabase, targetUserData, corsHeaders);
      case 'delete':
        return await deleteUser(supabase, targetUserData.id, corsHeaders);
      case 'list':
        return await listUsers(supabase, corsHeaders);
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
    }
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

// Create a new user
async function createUser(supabase, userData, corsHeaders) {
  const { email, password, name, role = 'user' } = userData;

  // Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });

  if (authError) {
    return new Response(
      JSON.stringify({ error: authError.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  // Update the user's role in the auth_users table
  const { error: updateError } = await supabase
    .from('auth_users')
    .update({ role })
    .eq('id', authData.user.id);

  if (updateError) {
    return new Response(
      JSON.stringify({ error: updateError.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }

  return new Response(
    JSON.stringify({ 
      message: "User created successfully",
      user: authData.user
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 201,
    }
  );
}

// Update an existing user
async function updateUser(supabase, userData, corsHeaders) {
  const { id, name, role, password } = userData;

  // Update auth user if password is provided
  if (password) {
    const { error: authError } = await supabase.auth.admin.updateUserById(
      id,
      { password }
    );

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
  }

  // Update user profile
  const updates = {};
  if (name) updates.name = name;
  if (role) updates.role = role;

  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabase
      .from('auth_users')
      .update(updates)
      .eq('id', id);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  }

  return new Response(
    JSON.stringify({ 
      message: "User updated successfully" 
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
}

// Delete a user
async function deleteUser(supabase, userId, corsHeaders) {
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  return new Response(
    JSON.stringify({ 
      message: "User deleted successfully" 
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
}

// List all users
async function listUsers(supabase, corsHeaders) {
  const { data: users, error } = await supabase
    .from('auth_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }

  return new Response(
    JSON.stringify({ users }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
}