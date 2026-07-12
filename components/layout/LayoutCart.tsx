import CartSidebar from '@/components/common/CartSidebar';
import { getCart } from '@/lib/cart';

export async function LayoutCart() {
  const initialCart = await getCart();
  return <CartSidebar initialCart={initialCart} />;
}
