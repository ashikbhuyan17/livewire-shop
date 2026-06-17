import { redirect } from 'next/navigation';

/** Legacy route — canonical ticket list lives at /user/ticket-list */
export default function SupportPage() {
  redirect('/user/ticket-list');
}
