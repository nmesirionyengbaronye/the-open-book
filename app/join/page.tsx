'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabaseClient } from '@/lib/supabase';
import { normalizeWhatsApp, isValidNigerianPhone } from '@/lib/validation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppBubble from '@/components/WhatsAppBubble';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://waitlist.uniui.com.ng';
const WHATSAPP_CHANNEL_LINK = process.env.WHATSAPP_CHANNEL_LINK || 'https://whatsapp.com/channel/0029VabcdEFGHIJKL1234567';

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referredByParam = searchParams.get('ref') || '';

  // Form schemas for each step
  const step1Schema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    whatsappNumber: z.string().refine(isValidNigerianPhone, {
      message: 'Please enter a valid Nigerian WhatsApp number'
    })
  });

  const step2Schema = z.object({
    institution: z.string().min(1, 'Please select your institution'),
    schoolCode: z.string().optional(),
    departmentCode: z.string().optional(),
    level: z.enum(['200', '300']),
    semester: z.enum(['1st', '2nd'])
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);

  // Initialize form data with referral parameter
  const defaultValues = {
    fullName: '',
    whatsappNumber: '',
    institution: '',
    schoolCode: '',
    departmentCode: '',
    level: '200' as const,
    semester: '1st' as const,
    referredBy: referredByParam
  };

  // Combined schema
  const fullSchema = z.object({
    ...step1Schema.shape,
    ...step2Schema.shape,
    referredBy: z.string().optional()
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(fullSchema),
    defaultValues,
    mode: 'onChange'
  });

  // Watch for institution changes to reset school/department
  const institution = watch('institution');
  useEffect(() => {
    if (institution) {
      setValue('schoolCode', '');
      setValue('departmentCode', '');
    }
  }, [institution, setValue]);

  // Watch for school changes to reset department
  const schoolCode = watch('schoolCode');
  useEffect(() => {
    if (schoolCode) {
      setValue('departmentCode', '');
    }
  }, [schoolCode, setValue]);

  // Generate referral code
  const generateReferralCode = (whatsappNumber: string) => {
    const normalized = normalizeWhatsApp(whatsappNumber);
    const hash = require('crypto')
      .createHash('sha256')
      .update(normalized + Date.now().toString())
      .digest('hex');
    return `UNI-${hash.substring(0, 6).toUpperCase()}`;
  };

  // Calculate position (simplified - in reality this would come from DB)
  const calculatePosition = async () => {
    try {
      const { count } = await supabaseClient
        .from('waitlist')
        .select('*', { count: 'exact', head: true });

      return (count || 0) + 1;
    } catch (error) {
      console.error('Error calculating position:', error);
      return Math.floor(Math.random() * 100) + 1; // Fallback
    }
  };

  const handleStep1Submit = async (data: z.infer<typeof step1Schema>) => {
    // Check for duplicate WhatsApp number
    try {
      const normalized = normalizeWhatsApp(data.whatsappNumber);
      const { data: existingUser, error } = await supabaseClient
        .from('waitlist')
        .select('id')
        .eq('whatsapp_number', normalized)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw error;
      }

      if (existingUser) {
        throw new Error('DUPLICATE_NUMBER');
      }

      setValue('whatsappNumber', normalized);
      setCurrentStep(2);
    } catch (error: any) {
      if (error.message === 'DUPLICATE_NUMBER') {
        toast.error('This WhatsApp number is already registered', {
          description: 'Click here to retrieve your link',
          action: {
            label: 'Retrieve Link',
            onClick: () => {
              router.push(`/retrieve?whatsapp_number=${encodeURIComponent(watch('whatsappNumber') || '')}`);
            }
          }
        });
      } else {
        toast.error('An error occurred. Please try again.');
      }
      console.error('Step 1 submission error:', error);
    }
  };

  const handleStep2Submit = async (data: z.infer<typeof step2Schema>) => {
    setIsSubmitting(true);

    try {
      // Generate referral code
      const whatsappNumber = watch('whatsappNumber') || '';
      const referralCode = generateReferralCode(whatsappNumber);

      // Calculate position
      const position = await calculatePosition();

      // Prepare data for insertion
      const insertData = {
        full_name: watch('fullName'),
        whatsapp_number: normalizeWhatsApp(whatsappNumber),
        institution: data.institution,
        school_code: data.schoolCode || null,
        department_code: data.departmentCode || null,
        level: parseInt(data.level),
        semester: data.semester,
        referral_code: referralCode,
        referred_by: referredByParam || null,
        position: position
      };

      // Insert into database
      const { error } = await supabaseClient.from('waitlist').insert(insertData);

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('DUPLICATE_ENTRY');
        }
        throw error;
      }

      // Update referrer's position if applicable
      if (referredByParam) {
        try {
          const { data: referrerData, error: referrerError } = await supabaseClient
            .from('waitlist')
            .select('position')
            .eq('referral_code', referredByParam)
            .single();

          if (!referrerError && referrerData) {
            const newPosition = Math.max(0, referrerData.position - 3);
            await supabaseClient
              .from('waitlist')
              .update({ position: newPosition })
              .eq('referral_code', referredByParam);
          }
        } catch (referrerError) {
          console.warn('Could not update referrer position:', referrerError);
          // Don't fail the main operation for this
        }
      }

      setSubmissionData({
        fullName: watch('fullName') || '',
        referralCode,
        position,
        whatsappNumber: normalizeWhatsApp(whatsappNumber)
      });
      setSubmissionSuccess(true);
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.message === 'DUPLICATE_ENTRY') {
        toast.error('You are already registered', {
          description: 'Click here to retrieve your link',
          action: {
            label: 'Retrieve Link',
            onClick: () => {
              router.push(`/retrieve?whatsapp_number=${encodeURIComponent(watch('whatsappNumber') || '')}`);
            }
          }
        });
      } else {
        toast.error('Registration failed. Please try again.');
      }
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    setCurrentStep(1);
    setSubmissionSuccess(false);
    setSubmissionData(null);
  };

  if (submissionSuccess && submissionData) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                <span className="text-[#D4AF37] font-bold text-xl">✓</span>
              </div>
              <h2 className="text-3xl font-heading text-[#D4AF37] mb-4">
                Welcome to Uni UI, {submissionData.fullName.split(' ')[0]}!
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                You've successfully joined the waitlist. Here are your details:
              </p>
            </div>

            <div className="bg-[#13131A] p-6 rounded-xl border border-[#D4AF37]/20 space-y-5">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#D4AF37] font-bold">#{submissionData.position}</span>
                </div>
                <div>
                  <h3 className="font-heading text-lg">Your Position</h3>
                  <p className="text-gray-400">
                    You are currently position <span className="font-medium text-white">#{submissionData.position}</span> on the waitlist
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#D4AF37] font-bold">🔑</span>
                </div>
                <div>
                  <h3 className="font-heading text-lg">Your Referral Code</h3>
                  <p className="text-gray-400">
                    Share this code with friends to move up the waitlist
                  </p>
                  <div className="mt-2 flex items-center space-x-3">
                    <input
                      type="text"
                      value={submissionData.referralCode}
                      readOnly
                      className="flex-1 px-3 py-2 bg-[#13131A] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(submissionData.referralCode);
                        toast.success('Referral code copied to clipboard!');
                      }}
                      className="px-3 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#FFD700] transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#D4AF37] font-bold">💬</span>
                </div>
                <div>
                  <h3 className="font-heading text-lg">Join the Community</h3>
                  <p className="text-gray-400">
                    Connect with other engineering students in our exclusive WhatsApp group
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <button
                onClick={handleReset}
                className="w-full px-4 py-3 bg-[#13131A] text-[#D4AF37] font-medium rounded-lg border border-[#D4AF37]/20 hover:bg-[#13131A]/50 transition-colors"
              >
                Register Another
              </button>

              <a
                href={WHATSAPP_CHANNEL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700] transition-colors"
              >
                Join WhatsApp Community →
              </a>
            </div>
          </div>
        </div>
        <Footer />
        <WhatsAppBubble />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
        <form onSubmit={handleSubmit(currentStep === 1 ? handleStep1Submit : handleStep2Submit)} className="w-full max-w-md space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-heading text-[#D4AF37] text-center mb-6">
              Join the Uni UI Waitlist
            </h2>
            <p className="text-center text-gray-400 max-w-xl mx-auto">
              {currentStep === 1
                ? 'Step 1 of 2: Enter your basic information to get started'
                : 'Step 2 of 2: Provide your academic details'}
            </p>
          </div>

          {currentStep === 1 && (
            <>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Full name must be at least 2 characters' }
                  })}
                  type="text"
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 bg-[#13131A] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                    errors.fullName ? 'border-[#D4AF37]' : ''
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  WhatsApp Number
                </label>
                <input
                  {...register('whatsappNumber', {
                    required: 'WhatsApp number is required',
                    validate: (value) => isValidNigerianPhone(value) || 'Please enter a valid Nigerian WhatsApp number'
                  })}
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  className={`w-full px-4 py-3 bg-[#13131A] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                    errors.whatsappNumber ? 'border-[#D4AF37]' : ''
                  }`}
                />
                {errors.whatsappNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.whatsappNumber.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Please enter your WhatsApp number in Nigerian format (e.g., +234 803 123 4567)
                </p>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Institution
                </label>
                <select
                  {...register('institution', {
                    required: 'Please select your institution'
                  })}
                  className="w-full px-4 py-3 bg-[#13131A] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="">Select your institution</option>
                  <option value="FUTO">Federal University of Technology, Owerri (FUTO)</option>
                  <option value="UNN">University of Nigeria, Nsukka (UNN)</option>
                  <option value="UNILAG">University of Lagos (UNILAG)</option>
                  <option value="OAU">Obafemi Awolowo University (OAU)</option>
                  <option value="FUNAAB">Federal University of Agriculture, Abeokuta (FUNAAB)</option>
                  <option value="LAUTECH">Ladoke Akintola University of Technology (LAUTECH)</option>
                  <option value="FUTMINNA">Federal University of Technology, Minna (FUTMINNA)</option>
                  <option value="FUTA">Federal University of Technology, Akure (FUTA)</option>
                  <option value="UNIPORT">University of Port Harcourt (UNIPORT)</option>
                  <option value="OTHER">My school isn't listed</option>
                </select>
                {errors.institution && (
                  <p className="text-xs text-red-500 mt-1">{errors.institution.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  School / Faculty
                </label>
                <select
                  {...register('schoolCode')}
                  className="w-full px-4 py-3 bg-[#13131A] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  disabled={!watch('institution') || watch('institution') === 'OTHER'}
                >
                  <option value="">Select school/faculty</option>
                  {watch('institution') === 'FUTO' && (
                    <>
                      <option value="ENGINEERING">School of Engineering</option>
                      <option value="AGRICULTURE">School of Agriculture</option>
                      <option value="SCIENCE">School of Science</option>
                      <option value="MANAGEMENT">School of Management Technology</option>
                    </>
                  )}
                  {watch('institution') === 'UNN' && (
                    <>
                      <option value="ENGINEERING">Faculty of Engineering</option>
                      <option value="SCIENCE">Faculty of Science</option>
                      <option value="AGRICULTURE">Faculty of Agriculture</option>
                      <option value="EDUCATION">Faculty of Education</option>
                    </>
                  )}
                  {watch('institution') === 'UNILAG' && (
                    <>
                      <option value="ENGINEERING">Faculty of Engineering</option>
                      <option value="SCIENCE">Faculty of Science</option>
                      <option value="SOCIAL_SCIENCES">Faculty of Social Sciences</option>
                      <option value="MANAGEMENT">Faculty of Management Sciences</option>
                    </>
                  )}
                  {watch('institution') === 'OTHER' && (
                    <option value="">Please specify your school/faculty</option>
                  )}
                </select>
                {errors.schoolCode && (
                  <p className="text-xs text-red-500 mt-1">{errors.schoolCode.message}</p>
                )}
                {!watch('institution') || watch('institution') === 'OTHER' ? (
                  <p className="text-xs text-gray-500 mt-1">
                    Please select your institution first
                  </p>
                ) : null}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Department
                </label>
                <select
                  {...register('departmentCode')}
                  className="w-full px-4 py-3 bg-[#13131A] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  disabled={!watch('schoolCode')}
                >
                  <option value="">Select department</option>
                  {watch('schoolCode') === 'ENGINEERING' && (
                    <>
                      <option value="COMPUTER_ENG">Computer Engineering</option>
                      <option value="ELECTRICAL_ENG">Electrical Engineering</option>
                      <option value="MECHANICAL_ENG">Mechanical Engineering</option>
                      <option value="CIVIL_ENG">Civil Engineering</option>
                      <option value="CHEMICAL_ENG">Chemical Engineering</option>
                      <option value="PETROLEUM_ENG">Petroleum Engineering</option>
                      <option value="AEROSPACE_ENG">Aerospace Engineering</option>
                      <option value="MATERIALS_ENG">Materials Engineering</option>
                    </>
                  )}
                  {watch('schoolCode') === 'SCIENCE' && (
                    <>
                      <option value="COMPUTER_SC">Computer Science</option>
                      <option value="PHYSICS">Physics</option>
                      <option value="CHEMISTRY">Chemistry</option>
                      <option value="MATHEMATICS">Mathematics</option>
                      <option value="STATISTICS">Statistics</option>
                      <option value="MICROBIOLOGY">Microbiology</option>
                    </>
                  )}
                  {watch('schoolCode') === 'OTHER' && (
                    <option value="">Please specify your department</option>
                  )}
                </select>
                {errors.departmentCode && (
                  <p className="text-xs text-red-500 mt-1">{errors.departmentCode.message}</p>
                )}
                {!watch('schoolCode') ? (
                  <p className="text-xs text-gray-500 mt-1">
                    Please select your school/faculty first
                  </p>
                ) : null}
              </div>

              <div className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Level
                    </label>
                    <div className="flex space-x-3">
                      <label className="flex items-center space-x-2">
                        <input
                          {...register('level', {
                            required: 'Please select your level'
                          })}
                          type="radio"
                          value="200"
                          className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <span className="text-white">200 Level</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          {...register('level', {
                            required: 'Please select your level'
                          })}
                          type="radio"
                          value="300"
                          className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <span className="text-white">300 Level</span>
                      </label>
                    </div>
                    {errors.level && (
                      <p className="text-xs text-red-500 mt-1">{errors.level.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Semester
                    </label>
                    <div className="flex space-x-3">
                      <label className="flex items-center space-x-2">
                        <input
                          {...register('semester', {
                            required: 'Please select your semester'
                          })}
                          type="radio"
                          value="1st"
                          className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <span className="text-white">First Semester</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          {...register('semester', {
                            required: 'Please select your semester'
                          })}
                          type="radio"
                          value="2nd"
                          className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <span className="text-white">Second Semester</span>
                      </label>
                    </div>
                    {errors.semester && (
                      <p className="text-xs text-red-500 mt-1">{errors.semester.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-[#D4AF37]/20">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 bg-[#13131A] text-[#D4AF37] font-medium rounded-lg hover:bg-[#13131A]/50 transition-colors"
              >
                Previous Step
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700] transition-colors disabled:opacity-50 ${
                !isValid && !isSubmitting ? 'opacity-50' : ''
              }`}
            >
              {isSubmitting ? 'Processing...' : currentStep === 1 ? 'Next Step' : 'Join Waitlist'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
      <WhatsAppBubble />
    </>
  );
}

export default function JoinPage() {
  return (
    <React.Suspense fallback={
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-4 border-[#D4AF37]/50 border-t-[#D4AF37]"></div>
            <p className="text-[#D4AF37]">Loading...</p>
          </div>
        </div>
        <Footer />
        <WhatsAppBubble />
      </>
    }>
      <JoinForm />
    </React.Suspense>
  );
}