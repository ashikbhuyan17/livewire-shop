'use server';

type ApiMessageResponse = {
  success?: boolean | string | number;
  status?: boolean | string | number;
  message?: string;
};

export type FormActionResult = {
  success: boolean;
  message: string;
};

function parseApiSuccess(data: ApiMessageResponse): boolean {
  const value = data.success ?? data.status;
  if (value === true || value === 1) return true;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'success';
  }
  return false;
}

async function postFormData(
  slug: string,
  formData: FormData,
): Promise<FormActionResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!apiUrl) {
    return { success: false, message: 'API URL is not configured.' };
  }

  try {
    const res = await fetch(`${apiUrl}${slug}`, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    let data: ApiMessageResponse = {};
    try {
      data = (await res.json()) as ApiMessageResponse;
    } catch {
      data = {};
    }

    const success = parseApiSuccess(data);
    const message =
      data.message?.trim() ||
      (success
        ? 'Request completed successfully.'
        : 'Request failed. Please try again.');

    return { success, message };
  } catch {
    return { success: false, message: 'Network error. Please try again.' };
  }
}
export async function subscribeNewsletter(formData: FormData): Promise<FormActionResult> {
  const email = formData.get('email')?.toString().trim() ?? '';
  if (!email) {
    return { success: false, message: 'Email is required.' };
  }

  const payload = new FormData();
  payload.append('email', email);
  return postFormData('/newsletter', payload);
}

export async function submitContactMessage(
  formData: FormData,
): Promise<FormActionResult> {
  const name = formData.get('name')?.toString().trim() ?? '';
  const email = formData.get('email')?.toString().trim() ?? '';
  const subject = formData.get('subject')?.toString().trim() ?? '';
  const message = formData.get('message')?.toString().trim() ?? '';

  if (!name || !email || !message) {
    return { success: false, message: 'Name, email, and message are required.' };
  }

  const payload = new FormData();
  payload.append('name', name);
  payload.append('email', email);
  payload.append('subject', subject);
  payload.append('message', message);
  return postFormData('/contact-message', payload);
}
