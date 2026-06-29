'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function PreOrderPageClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    product: '',
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product.trim()) {
      toast.error('Enter a product name or URL');
      return;
    }
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Name and phone number are required');
      return;
    }
    if (!agreed) {
      toast.error('Please accept the Terms & Conditions');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Pre-order request submitted! We will contact you soon.');
      setForm({ product: '', name: '', phone: '', email: '', address: '' });
      setAgreed(false);
      clearImage();
    }, 900);
  };

  return (
    <div className="mx-auto max-w-[95rem] px-3 py-5 sm:px-4 sm:py-7 lg:px-6">
      {/* Breadcrumb */}
      <nav
        className="mb-5 flex flex-wrap items-center gap-1 text-xs text-slate-500 sm:text-sm"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="transition hover:text-primary">
          Home
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-800">Pre-Order</span>
      </nav>

      <div className="mx-auto max-w-2xl">
        {/* Form card */}
        <div className="rounded-xl bg-white p-5 shadow-sm sm:p-7 lg:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Looking for something different?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Put your information in the box…
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Product */}
            <div>
              <Label
                htmlFor="pre-product"
                className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-500"
              >
                Product name / URL
              </Label>
              <Input
                id="pre-product"
                value={form.product}
                onChange={(e) => update('product')(e.target.value)}
                placeholder="e.g. iPhone 17 Pro Max or paste a link"
                className="h-12 rounded-xl border-slate-200 bg-white focus-visible:ring-primary"
              />
            </div>

            {/* Image upload */}
            <div>
              <Label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Reference image (optional)
              </Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
                aria-label="Upload reference image"
              />
              {imagePreview ? (
                <div className="relative inline-flex">
                  <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <Image
                      src={imagePreview}
                      alt="Reference preview"
                      fill
                      sizes="96px"
                      className="object-contain p-1"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white shadow hover:bg-slate-700"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <ImagePlus className="mr-2 h-4 w-4 text-secondary" />
                  Add Image
                </Button>
              )}
            </div>

            {/* Name + Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="pre-name"
                  className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-500"
                >
                  Full name
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="pre-name"
                    value={form.name}
                    onChange={(e) => update('name')(e.target.value)}
                    placeholder="Your name"
                    className="h-12 rounded-xl border-slate-200 bg-white pl-10 focus-visible:ring-primary"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="pre-phone"
                  className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-500"
                >
                  Phone number
                </Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="pre-phone"
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(e) => update('phone')(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="h-12 rounded-xl border-slate-200 bg-white pl-10 focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <Label
                htmlFor="pre-email"
                className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-500"
              >
                Email (optional)
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="pre-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email')(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 rounded-xl border-slate-200 bg-white pl-10 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <Label
                htmlFor="pre-address"
                className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-500"
              >
                Address
              </Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Textarea
                  id="pre-address"
                  value={form.address}
                  onChange={(e) => update('address')(e.target.value)}
                  placeholder="House / flat, road, area, city…"
                  rows={3}
                  className="min-h-[90px] resize-y rounded-xl border-slate-200 bg-white pl-10 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-2.5">
              <Checkbox
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                className="mt-0.5 border-primary data-[state=checked]:bg-primary"
              />
              <span className="text-sm text-slate-600">
                I accept the{' '}
                <Link
                  href="/pages/terms"
                  className="font-semibold text-primary hover:underline"
                >
                  Terms &amp; Conditions
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-xl bg-primary text-sm font-bold uppercase tracking-wide text-white shadow-md hover:bg-primary/90"
            >
              {submitting ? 'Submitting…' : 'Submit Pre-Order'}
            </Button>

            <div className="pt-1 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
