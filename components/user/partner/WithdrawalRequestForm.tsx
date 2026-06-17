'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { submitWithdrawalRequest } from '@/lib/fetcher';
import { CURRENCY_SYMBOL, formatAmount } from '@/lib/currency';
import { toast } from 'sonner';

const PAYMENT_METHODS = ['Bkash', 'Nagad', 'Rocket', 'Bank Transfer'] as const;

type Props = {
  availableBalance: string | number;
};

export default function WithdrawalRequestForm({ availableBalance }: Props) {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const balanceNum = Number(availableBalance);
  const hasBalance = Number.isFinite(balanceNum) && balanceNum > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = amount.trim();
    if (!amountValue || Number(amountValue) <= 0) {
      toast.error('Enter a valid withdrawal amount');
      return;
    }
    if (!accountNumber.trim()) {
      toast.error('Account number is required');
      return;
    }
    if (!paymentDetails.trim()) {
      toast.error('Payment details are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitWithdrawalRequest({
        amount: amountValue,
        payment_method: paymentMethod,
        account_number: accountNumber.trim(),
        payment_details: paymentDetails.trim(),
      });

      const ok =
        res.status === true ||
        String(res.status ?? '').toLowerCase() === 'success';

      if (ok) {
        toast.success(res.message ?? 'Withdrawal request submitted');
        setAmount('');
        setAccountNumber('');
        setPaymentDetails('');
        router.refresh();
      } else {
        toast.error(res.message ?? 'Could not submit withdrawal request');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/80 to-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Request withdrawal
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Available balance:{' '}
          <span className="font-bold tabular-nums text-headerBg">
            <span className="font-extrabold">{CURRENCY_SYMBOL}</span>
            {formatAmount(availableBalance)}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="withdraw-amount">Amount</Label>
          <Input
            id="withdraw-amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 90"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={!hasBalance || isSubmitting}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="withdraw-method">Payment method</Label>
          <Select
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            disabled={!hasBalance || isSubmitting}
          >
            <SelectTrigger id="withdraw-method" className="rounded-xl">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="withdraw-account">Account number</Label>
          <Input
            id="withdraw-account"
            placeholder="e.g. 01754563542"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            disabled={!hasBalance || isSubmitting}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="withdraw-details">Payment details</Label>
          <Textarea
            id="withdraw-details"
            placeholder="e.g. Bkash Payment"
            rows={3}
            value={paymentDetails}
            onChange={(e) => setPaymentDetails(e.target.value)}
            disabled={!hasBalance || isSubmitting}
            className="resize-y rounded-xl"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!hasBalance || isSubmitting}
        className="mt-5 h-11 w-full rounded-xl bg-headerBg font-semibold text-white hover:bg-headerBg/90 sm:w-auto sm:min-w-[12rem]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Submitting…
          </>
        ) : (
          'Submit request'
        )}
      </Button>

      {!hasBalance ? (
        <p className="mt-3 text-sm text-amber-700">
          You do not have enough balance to withdraw right now.
        </p>
      ) : null}
    </form>
  );
}
