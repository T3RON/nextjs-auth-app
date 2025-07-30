'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, LoginFormValues } from '@/utils/validation';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import styles from './auth.module.scss';

export default function AuthPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Show loading for at least 1 second for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store phone number for verification page
      sessionStorage.setItem('pendingPhoneNumber', data.phoneNumber);
      // Redirect to verification page instead of direct login
      router.push(`/verify?phone=${encodeURIComponent(data.phoneNumber)}`);
    } catch (error) {
      setError('خطا در برقراری ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.title}>ورود به حساب کاربری</h1>
          <p className={styles.subtitle}>لطفاً شماره موبایل خود را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            {...register('phoneNumber')}
            label="شماره موبایل"
            placeholder="۰۹xxxxxxxxx"
            error={errors.phoneNumber?.message}
            fullWidth
            className={styles.phoneInput}
            type="tel"
            maxLength={11}
            dir="ltr"
          />

          {error && <div className={styles.errorMessage}>{error}</div>}

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            loadingText="در حال ارسال..."
            className={styles.submitButton}
            disabled={isLoading}
          >
            ورود
          </Button>
        </form>

        <div className={styles.helpText}>
          <p>شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود</p>
        </div>
      </div>
    </div>
  );
}