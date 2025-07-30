import { z } from 'zod';

// Iranian phone number validation schema
export const phoneNumberSchema = z
  .string()
  .min(11, { message: 'شماره موبایل باید ۱۱ رقم باشد' })
  .max(11, { message: 'شماره موبایل باید ۱۱ رقم باشد' })
  .regex(/^09[0-9]{9}$/, { message: 'شماره موبایل باید با ۰۹ شروع شود' });

// Login form validation schema
export const loginFormSchema = z.object({
  phoneNumber: phoneNumberSchema,
});

// Verification code validation schema
export const verificationCodeSchema = z.object({
  code: z
    .string()
    .min(4, { message: 'کد تایید باید 4 رقم باشد' })
    .max(4, { message: 'کد تایید باید 4 رقم باشد' })
    .regex(/^[0-9]{4}$/, { message: 'کد تایید باید فقط شامل اعداد باشد' }),
  phoneNumber: phoneNumberSchema,
});

// Type definitions based on schemas
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type VerificationFormValues = z.infer<typeof verificationCodeSchema>;