'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, LoginFormValues } from '@/utils/validation';
import { sendVerificationCode } from '@/utils/auth';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import styles from './login.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const success = await sendVerificationCode(data.phoneNumber);
      if (success) {
        // Navigate to verification page with phone number
        router.push(`/verify?phone=${encodeURIComponent(data.phoneNumber)}`);
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>ورود به حساب کاربری</h1>
        <p className={styles.subtitle}>لطفا شماره موبایل خود را وارد کنید</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            {...register('phoneNumber')}
            label="شماره موبایل"
            placeholder="مثال: 09123456789"
            error={errors.phoneNumber?.message}
            fullWidth
            className={styles.phoneInput}
            dir="ltr"
          />
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
            className={styles.submitButton}
          >
            دریافت کد تایید
          </Button>
        </form>
      </div>
    </div>
  );
}