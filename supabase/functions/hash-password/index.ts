import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to convert Uint8Array to base64
function uint8ArrayToBase64(arr: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < arr.length; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}

// Simple but secure password hashing using Web Crypto API
async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const encoder = new TextEncoder();
  
  // Generate salt if not provided
  const saltBytes = salt 
    ? Uint8Array.from(atob(salt), c => c.charCodeAt(0))
    : crypto.getRandomValues(new Uint8Array(16));
  
  // Combine password with salt
  const passwordData = encoder.encode(password);
  const combined = new Uint8Array(passwordData.length + saltBytes.length);
  combined.set(passwordData);
  combined.set(saltBytes, passwordData.length);
  
  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  
  // Convert to base64
  const hashArray = new Uint8Array(hashBuffer);
  const hashBase64 = uint8ArrayToBase64(hashArray);
  const saltBase64 = salt || uint8ArrayToBase64(saltBytes);
  
  return { hash: hashBase64, salt: saltBase64 };
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    // Stored format: salt:hash
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;
    
    const { hash: computedHash } = await hashPassword(password, salt);
    return computedHash === hash;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, password, storedHash } = await req.json();
    
    console.log(`Password action: ${action}`);
    
    if (action === 'hash') {
      if (!password) {
        return new Response(
          JSON.stringify({ error: 'Password is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const { hash, salt } = await hashPassword(password);
      const combinedHash = `${salt}:${hash}`;
      
      console.log('Password hashed successfully');
      
      return new Response(
        JSON.stringify({ hash: combinedHash }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (action === 'verify') {
      if (!password || !storedHash) {
        return new Response(
          JSON.stringify({ error: 'Password and stored hash are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const isValid = await verifyPassword(password, storedHash);
      
      console.log(`Password verification: ${isValid ? 'success' : 'failed'}`);
      
      return new Response(
        JSON.stringify({ valid: isValid }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action. Use "hash" or "verify"' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Hash password error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
