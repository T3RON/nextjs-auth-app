'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verificationCodeSchema, VerificationFormValues } from '@/utils/validation';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import styles from './verify.module.scss';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get phone number from URL query parameter
  const phoneNumber = searchParams.get('phone') || '';
  
  // Redirect to login if no phone number is provided
  useEffect(() => {
    if (!phoneNumber) {
      router.replace('/login');
    }
  }, [phoneNumber, router]);
  
  // Countdown timer for resending code
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: '1111',
      phoneNumber,
    },
  });

  const onSubmit = async (data: VerificationFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (data.code === '1111') {
        const success = await login(phoneNumber);
        if (success) {
          router.push('/dashboard');
        } else {
          setError('خطا در ورود. لطفاً دوباره تلاش کنید.');
        }
      } else {
        setError('کد تایید اشتباه است. لطفاً دوباره امتحان کنید.');
      }
    } catch (error) {
      setError('خطا در برقراری ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // In a real app, call the API to resend the code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      console.error('Error resending code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.verifyContainer}>
      <div className={styles.verifyCard}>
        <h1 className={styles.title}>تایید شماره موبایل</h1>
        <p className={styles.subtitle}>
          کد تایید به شماره {phoneNumber} ارسال شد
        </p>
        <p style={{ 
          fontSize: '14px', 
          color: '#666', 
          marginTop: '8px',
          textAlign: 'center',
          backgroundColor: '#f0f8ff',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px dashed #1890ff'
        }}>
          💡 راهنما: کد تایید پیش‌فرض برای تست: <strong>1111</strong>
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            {...register('code')}
            label="کد تایید"
            placeholder="۱۱۱۱"
            error={errors.code?.message}
            fullWidth
            className={styles.codeInput}
            dir="ltr"
            maxLength={4}
            style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '8px' }}
          />
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
            loadingText="در حال بررسی..."
            className={styles.submitButton}
            disabled={isLoading}
          >
            تایید و ورود
          </Button>
        </form>
        
        <div className={styles.resendContainer}>
          {canResend ? (
            <button 
              onClick={handleResendCode} 
              className={styles.resendButton}
              disabled={isLoading}
            >
              ارسال مجدد کد
            </button>
          ) : (
            <p className={styles.countdownText}>
              ارسال مجدد کد تا {countdown} ثانیه دیگر
            </p>
          )}
        </div>
      </div>
    </div>
  );
}