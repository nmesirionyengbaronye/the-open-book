import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizeWhatsApp, isValidNigerianPhone } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const whatsappNumber = searchParams.get("whatsapp_number");

    if (!whatsappNumber) {
      return NextResponse.json(
        { error: "WhatsApp number parameter is required" },
        { status: 400 },
      );
    }

    if (!isValidNigerianPhone(whatsappNumber)) {
      return NextResponse.json(
        { error: "Please enter a valid Nigerian WhatsApp number" },
        { status: 400 },
      );
    }

    // Normalize the WhatsApp number
    const normalizedWhatsApp = normalizeWhatsApp(whatsappNumber);

    // Look up the waitlist entry
    const { data, error } = await supabaseAdmin
      .from("waitlist")
      .select("referral_code, position")
      .eq("whatsapp_number", normalizedWhatsApp)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return NextResponse.json(
          { error: "No record found for this WhatsApp number" },
          { status: 404 },
        );
      }
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: "No record found for this WhatsApp number" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      referral_code: data.referral_code,
      position: data.position,
    });
  } catch (error: any) {
    console.error("Waitlist retrieve error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
