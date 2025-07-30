'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button/Button';
import styles from './dashboard.module.scss';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>
          <span className={styles.loadingDot}></span>
          <span className={styles.loadingDot}></span>
          <span className={styles.loadingDot}></span>
        </div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardCard}>
        <h1 className={styles.title}>خوش آمدید!</h1>
        <p className={styles.subtitle}>شما با موفقیت وارد شدید</p>
        
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <img 
              src={user.picture} 
              alt={user.name} 
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.userDetails}>
            <p><strong>نام:</strong> {user.name}</p>
            <p><strong>ایمیل:</strong> {user.email}</p>
            <p><strong>شماره موبایل:</strong> {user.phoneNumber}</p>
          </div>
        </div>
        
        <Button onClick={handleLogout} variant="outline">
          خروج از حساب
        </Button>
      </div>
    </div>
  );
}