"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { clampQtyToAvailableStock } from "@/lib/stock-utils";

const CART_KEY = "guest_cart";
const JWT_SECRET = process.env.GUEST_CART_JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "GUEST_CART_JWT_SECRET is not defined in environment variables",
  );
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

export type CartItem = {
  id: number;
  name: string;
  image: string;
  qty: number;
  price: number;
  product_color_id: number;
  product_variant_id: number;
  /** Max units allowed in bag (from variant `available_stock`). */
  available_stock: number;
};

export type Cart = {
  items: CartItem[];
};


async function signCart(cart: Cart): Promise<string> {
  return await new SignJWT({ cart })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // adjust if you want
    .sign(secretKey);
}

async function verifyCart(token: string): Promise<Cart | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    const cart = payload.cart as Cart | undefined;

    if (!cart || !Array.isArray(cart.items)) return null;
    return cart;
  } catch {
    return null;
  }
}


export async function getCart(): Promise<Cart> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CART_KEY)?.value;

  if (!token) return { items: [] };

  const cart = await verifyCart(token);
  if (!cart) return { items: [] };

  return cart;
}

export async function setCart(cart: Cart) {
  const token = await signCart(cart);

  const cookieStore = await cookies();
  cookieStore.set(CART_KEY, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}


export async function getCartAction() {
  return getCart();
}

function applyCartItemQty(
  item: CartItem,
  requestedQty: number,
): CartItem | null {
  const max = item.available_stock ?? 0;
  const qty = clampQtyToAvailableStock(requestedQty, max);
  if (qty <= 0) return null;
  return { ...item, qty, available_stock: max };
}

export async function addToCartAction(item: CartItem) {
  const cart = await getCart();
  const max = item.available_stock ?? 0;
  if (max <= 0) return cart;

  const existing = cart.items.find((i) => i.id === item.id);

  if (existing) {
    const merged = applyCartItemQty(
      { ...existing, available_stock: max },
      existing.qty + item.qty,
    );
    if (merged) {
      Object.assign(existing, merged);
    } else {
      cart.items = cart.items.filter((i) => i.id !== item.id);
    }
  } else {
    const line = applyCartItemQty(item, item.qty);
    if (line) cart.items.push(line);
  }

  await setCart(cart);
  return cart;
}

export async function removeFromCartAction(id: number) {
  const cart = await getCart();

  cart.items = cart.items.filter((i) => i.id !== id);

  await setCart(cart);
  return cart;
}

export async function updateQuantityAction(id: number, quantity: number) {
  const cart = await getCart();

  const item = cart.items.find((i) => i.id === id);
  if (!item) return cart;

  const max = item.available_stock ?? 0;
  const next = clampQtyToAvailableStock(quantity, max);
  if (next <= 0) {
    cart.items = cart.items.filter((i) => i.id !== id);
  } else {
    item.qty = next;
  }

  await setCart(cart);
  return cart;
}

export async function clearCartAction() {
  const emptyCart = { items: [] };
  await setCart(emptyCart);
  return emptyCart;
}
