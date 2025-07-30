import React, { forwardRef } from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  {
    label,
    error,
    fullWidth = false,
    className,
    startIcon,
    endIcon,
    helperText,
    ...props
  },
  ref
) => {
  return (
    <div className={`${styles.inputContainer} ${fullWidth ? styles.fullWidth : ''} ${className || ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputWrapper} ${error ? styles.error : ''}`}>
        {startIcon && <div className={styles.startIcon}>{startIcon}</div>}
        <input
          ref={ref}
          className={`${styles.input} ${startIcon ? styles.hasStartIcon : ''} ${endIcon ? styles.hasEndIcon : ''}`}
          {...props}
        />
        {endIcon && <div className={styles.endIcon}>{endIcon}</div>}
      </div>
      {(error || helperText) && (
        <p className={`${styles.helperText} ${error ? styles.errorText : ''}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;