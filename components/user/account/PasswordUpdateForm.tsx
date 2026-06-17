'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { updateUserPassword } from '@/lib/fetcher';

const MIN_PASSWORD_LENGTH = 6;

type FieldKey = 'current_password' | 'new_password' | 'new_password_confirmation';

type Errors = Partial<Record<FieldKey, string>>;

function firstValidationError(errors: unknown): string | undefined {
  if (!errors || typeof errors !== 'object') return undefined;
  for (const v of Object.values(errors as Record<string, unknown>)) {
    if (Array.isArray(v) && typeof v[0] === 'string') return v[0];
    if (typeof v === 'string') return v;
  }
  return undefined;
}

function mapServerErrors(errors: unknown): Errors {
  if (!errors || typeof errors !== 'object') return {};
  const out: Errors = {};
  const e = errors as Record<string, unknown>;
  const pick = (key: FieldKey) => {
    const v = e[key];
    if (Array.isArray(v) && typeof v[0] === 'string') out[key] = v[0];
    else if (typeof v === 'string') out[key] = v;
  };
  pick('current_password');
  pick('new_password');
  pick('new_password_confirmation');
  return out;
}

export default function PasswordUpdateForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState<Record<FieldKey, boolean>>({
    current_password: false,
    new_password: false,
    new_password_confirmation: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleShow = (field: FieldKey) =>
    setShow((s) => ({ ...s, [field]: !s[field] }));

  const validate = (): boolean => {
    const next: Errors = {};
    if (!currentPassword) next.current_password = 'Current password is required';
    if (!newPassword) {
      next.new_password = 'New password is required';
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      next.new_password = `New password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    } else if (newPassword === currentPassword) {
      next.new_password = 'New password must be different from current password';
    }
    if (!confirmPassword) {
      next.new_password_confirmation = 'Please confirm your new password';
    } else if (confirmPassword !== newPassword) {
      next.new_password_confirmation = 'Passwords do not match';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await updateUserPassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      const ok =
        res?.status === true ||
        res?.status === 'success' ||
        String(res?.status || '').toLowerCase() === 'success';

      if (ok) {
        toast.success(res?.message ?? 'Password updated');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
        router.refresh();
      } else {
        const fieldErrors = mapServerErrors(res?.errors);
        if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
        toast.error(
          res?.message ||
            firstValidationError(res?.errors) ||
            'Failed to update password',
        );
      }
    } catch {
      toast.error('Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields: Array<{
    key: FieldKey;
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    autoComplete: string;
  }> = [
    {
      key: 'current_password',
      id: 'current-password',
      label: 'Current password',
      placeholder: 'Enter your current password',
      value: currentPassword,
      onChange: setCurrentPassword,
      autoComplete: 'current-password',
    },
    {
      key: 'new_password',
      id: 'new-password',
      label: 'New password',
      placeholder: `At least ${MIN_PASSWORD_LENGTH} characters`,
      value: newPassword,
      onChange: setNewPassword,
      autoComplete: 'new-password',
    },
    {
      key: 'new_password_confirmation',
      id: 'confirm-password',
      label: 'Confirm new password',
      placeholder: 'Re-enter your new password',
      value: confirmPassword,
      onChange: setConfirmPassword,
      autoComplete: 'new-password',
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-busy={isSubmitting}
      aria-label="Change password"
    >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {fields.map((f) => {
            const fieldError = errors[f.key];
            const visible = show[f.key];
            return (
              <div key={f.key} className="space-y-2">
                <Label htmlFor={f.id}>
                  <span className="text-red-500">*</span> {f.label}
                </Label>
                <div className="relative">
                  <Input
                    id={f.id}
                    type={visible ? 'text' : 'password'}
                    autoComplete={f.autoComplete}
                    placeholder={f.placeholder}
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                    aria-invalid={fieldError ? true : undefined}
                    aria-describedby={fieldError ? `${f.id}-error` : undefined}
                    className={cn(
                      'rounded-md border-gray-300 pr-10',
                      fieldError && 'border-red-400 focus-visible:ring-red-400/40',
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(f.key)}
                    aria-label={
                      visible ? `Hide ${f.label.toLowerCase()}` : `Show ${f.label.toLowerCase()}`
                    }
                    aria-pressed={visible}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-headerBg/40"
                  >
                    {visible ? (
                      <EyeOff className="h-4 w-4" aria-hidden />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden />
                    )}
                  </button>
                </div>
                {fieldError && (
                  <p id={`${f.id}-error`} className="text-sm text-red-500">
                    {fieldError}
                  </p>
                )}
              </div>
            );
          })}
        </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md py-3 text-base font-medium text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Updating…
          </>
        ) : (
          'Update Password'
        )}
      </Button>
    </form>
  );
}
