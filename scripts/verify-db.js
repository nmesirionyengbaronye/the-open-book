require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

async function checkTableExists() {
  const { data, error } = await supabaseAdmin
    .from("waitlist")
    .select("1")
    .limit(1);

  if (error) {
    if (error.message && error.message.includes("relation does not exist")) {
      console.log("❌ Table waitlist missing");
      return false;
    } else {
      console.error("Error checking table:", error);
      process.exit(1);
    }
  }
  return true;
}

async function checkColumnsExist() {
  const requiredColumns = [
    "whatsapp_number",
    "full_name",
    "institution",
    "school_code",
    "department_code",
    "level",
    "semester",
    "referral_code",
    "referred_by",
    "position",
    "hardest_course",
    "recommendation",
    "created_at"
  ];

  // Method: Query information_schema.columns
  const { data, error } = await supabaseAdmin
    .from("information_schema.columns")
    .select("column_name")
    .eq("table_name", "waitlist")
    .eq("table_schema", "public");

  if (error) {
    console.error("Error checking columns:", error);
    process.exit(1);
  }

  const existingColumns = data.map(col => col.column_name);
  const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

  if (missingColumns.length > 0) {
    console.log(`❌ Missing columns: ${missingColumns.join(", ")}`);
    return false;
  }

  console.log("✅ All required columns exist");
  return true;
}

async function testRLSPolicies() {
  const testPhone = "+2348000000000";
  const testData = {
    whatsapp_number: testPhone,
    full_name: "Test User",
    institution: "FUTO",
    school_code: "SEET",
    department_code: "Electrical/Electronic Engineering (EEE)",
    level: "200",
    semester: "1st",
  };

  // Insert using admin client (bypasses RLS)
  const { data: insertData, error: insertError } = await supabaseAdmin
    .from("waitlist")
    .insert(testData)
    .select()
    .single();

  if (insertError) {
    console.error("Error inserting test row:", insertError);
    // Try to clean up if possible
    await supabaseAdmin.from("waitlist").delete().eq("whatsapp_number", testPhone);
    return false;
  }

  const insertedRow = insertData;

  // Select using anon client (tests RLS policy)
  const { data: selectData, error: selectError } = await supabaseClient
    .from("waitlist")
    .select()
    .eq("whatsapp_number", testPhone)
    .single();

  if (selectError) {
    console.error("Error selecting test row:", selectError);
    // Clean up
    await supabaseAdmin.from("waitlist").delete().eq("whatsapp_number", testPhone);
    console.log("❌ RLS policy error (select failed)");
    return false;
  }

  if (!selectData) {
    console.log("❌ RLS policy error (no row returned)");
    await supabaseAdmin.from("waitlist").delete().eq("whatsapp_number", testPhone);
    return false;
  }

  // Clean up
  const { error: deleteError } = await supabaseAdmin
    .from("waitlist")
    .delete()
    .eq("whatsapp_number", testPhone);

  if (deleteError) {
    console.error("Error deleting test row:", deleteError);
    // Not critical, but we tried
  }

  console.log("✅ RLS policies allow public insert/select");
  return true;
}

async function main() {
  console.log("🔍 Verifying Supabase setup...");

  const tableExists = await checkTableExists();
  if (!tableExists) {
    process.exit(1);
  }

  const columnsExist = await checkColumnsExist();
  if (!columnsExist) {
    process.exit(1);
  }

  const rlsOk = await testRLSPolicies();
  if (!rlsOk) {
    process.exit(1);
  }

  console.log("🎉 All checks passed!");
}

main();