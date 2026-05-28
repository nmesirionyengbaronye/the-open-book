import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import * as z from "zod";
import { normalizeWhatsApp, isValidNigerianPhone } from "@/lib/validation";
import crypto from "crypto";

// Validation schema
const waitlistJoinSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  whatsappNumber: z.string().refine(isValidNigerianPhone, {
    message: "Please enter a valid Nigerian WhatsApp number",
  }),
  institution: z.string().min(1, "Please select your institution"),
  schoolCode: z.string().optional(),
  departmentCode: z.string().optional(),
  level: z.enum(["200", "300"], {
    errorMap: () => ({ message: "Please select your level (200 or 300)" }),
  }),
  semester: z.enum(["1st", "2nd"], {
    errorMap: () => ({ message: "Please select your semester" }),
  }),
  referredBy: z
    .string()
    .optional()
    .refine((val) => !val || isValidNigerianPhone(val), {
      message: "Please enter a valid Nigerian WhatsApp number for referral",
    }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = waitlistJoinSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    const {
      fullName,
      whatsappNumber,
      institution,
      schoolCode,
      departmentCode,
      level,
      semester,
      referredBy,
    } = validationResult.data;

    // Normalize WhatsApp number
    const normalizedWhatsApp = normalizeWhatsApp(whatsappNumber);
    const normalizedReferral = referredBy
      ? normalizeWhatsApp(referredBy)
      : null;

    // Check for duplicate WhatsApp number
    const { data: existingUser, error: duplicateError } = await supabaseAdmin
      .from("waitlist")
      .select("id")
      .eq("whatsapp_number", normalizedWhatsApp)
      .single();

    if (duplicateError && duplicateError.code !== "PGRST116") {
      throw duplicateError;
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "This WhatsApp number is already registered" },
        { status: 409 },
      );
    }

    // Validate referral if provided
    if (normalizedReferral) {
      const { data: referrerData, error: referrerError } = await supabaseAdmin
        .from("waitlist")
        .select("id, referral_code, position")
        .eq("whatsapp_number", normalizedReferral)
        .single();

      if (referrerError && referrerError.code !== "PGRST116") {
        throw referrerError;
      }

      if (!referrerData) {
        return NextResponse.json(
          { error: "Invalid referral code" },
          { status: 400 },
        );
      }
    }

    // Generate referral code: UNI-XXXXXX
    const hash = crypto
      .createHash("sha256")
      .update(normalizedWhatsApp + Date.now().toString())
      .digest("hex");
    const referralCode = `UNI-${hash.substring(0, 6).toUpperCase()}`;

    // Calculate position: COUNT(*) + 1
    const { count } = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    const position = (count || 0) + 1;

    // Insert new waitlist entry
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from("waitlist")
      .insert({
        full_name: fullName,
        whatsapp_number: normalizedWhatsApp,
        institution: institution,
        school_code: schoolCode || null,
        department_code: departmentCode || null,
        level: parseInt(level),
        semester: semester,
        referral_code: referralCode,
        referred_by: normalizedReferral || null,
        position: position,
      })
      .select();

    if (insertError) {
      if (insertError.code === "23505") {
        // Unique violation
        return NextResponse.json(
          { error: "This WhatsApp number is already registered" },
          { status: 409 },
        );
      }
      throw insertError;
    }

    // Update referrer's position if applicable
    if (normalizedReferral) {
      try {
        const { data: referrerData, error: referrerFetchError } =
          await supabaseAdmin
            .from("waitlist")
            .select("position")
            .eq("whatsapp_number", normalizedReferral)
            .single();

        if (!referrerFetchError && referrerData) {
          const newPosition = Math.max(0, referrerData.position - 3);
          await supabaseAdmin
            .from("waitlist")
            .update({ position: newPosition })
            .eq("whatsapp_number", normalizedReferral);
        }
      } catch (referralError) {
        // Log error but don't fail the main operation
        console.warn("Could not update referrer position:", referralError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        referral_code: referralCode,
        position: position,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Waitlist join error:", error);

    // Handle specific error types
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This WhatsApp number is already registered" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
