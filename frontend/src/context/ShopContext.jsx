import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  API_URL,
  buildCoffeeCatalog,
  fallbackCoffees,
  formatPrice,
} from '../data/shopData';

const CART_STORAGE_KEY = 'onecafe-cart-v1';
const TOKEN_STORAGE_KEY = 'onecafe-token';

const ShopContext = createContext(null);

function getStoredToken() {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? '';
}

function authJsonHeaders() {
  const token = getStoredToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function authBearerHeaders() {
  const token = getStoredToken();
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function readStoredCart() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function ShopProvider({ children }) {
  const [coffees, setCoffees] = useState(fallbackCoffees);
  const [menuStatus, setMenuStatus] = useState('loading');
  const [menuError, setMenuError] = useState('');
  const [cart, setCart] = useState(readStoredCart);

  function getStoredUser() {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const parsed = JSON.parse(window.localStorage.getItem('onecafe-user') ?? 'null');
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }
      const customerId = Number.parseInt(parsed.customer_id, 10);
      return Number.isNaN(customerId) || customerId <= 0 ? null : { ...parsed, customer_id: customerId };
    } catch {
      return null;
    }
  }

  function useServerCart() {
    const user = getStoredUser();
    const token = getStoredToken();
    return Boolean(user && token);
  }

  async function fetchServerCart() {
    const response = await fetch(`${API_URL}/api/cart`, {
      headers: authBearerHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Cart request failed with status ${response.status}.`);
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];

    return items.map((item) => ({
      coffee_id: Number(item.coffee_id),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
    }));
  }

  async function loadCartForCurrentUser() {
    if (!useServerCart()) {
      setCart(readStoredCart());
      return;
    }

    try {
      const serverCart = await fetchServerCart();
      setCart(serverCart);
    } catch {
      setCart([]);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadCoffees() {
      try {
        const response = await fetch(`${API_URL}/api/coffees`);

        if (!response.ok) {
          throw new Error(`Menu request failed with status ${response.status}.`);
        }

        const data = await response.json();

        if (!cancelled) {
          startTransition(() => {
            setCoffees(Array.isArray(data) && data.length > 0 ? data : fallbackCoffees);
            setMenuStatus('ready');
            setMenuError('');
          });
        }
      } catch (error) {
        if (!cancelled) {
          startTransition(() => {
            setCoffees(fallbackCoffees);
            setMenuStatus('fallback');
            setMenuError(error.message);
          });
        }
      }
    }

    loadCoffees();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!useServerCart()) {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      }
    }
  }, [cart]);

  useEffect(() => {
    loadCartForCurrentUser();

    function handleUserChange() {
      loadCartForCurrentUser();
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('onecafe-user-changed', handleUserChange);
      window.addEventListener('storage', handleUserChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('onecafe-user-changed', handleUserChange);
        window.removeEventListener('storage', handleUserChange);
      }
    };
  }, []);

  const catalog = buildCoffeeCatalog(coffees);

  const cartItems = cart
    .map((entry) => {
      const catalogItem = catalog.find((coffee) => coffee.coffee_id === entry.coffee_id);

      if (!catalogItem) {
        return null;
      }

      return {
        ...catalogItem,
        quantity: entry.quantity,
        unitPrice: Number(entry.unit_price ?? catalogItem.price),
        lineTotal: Number(entry.unit_price ?? catalogItem.price) * entry.quantity,
        priceLabel: formatPrice(entry.unit_price ?? catalogItem.price),
      };
    })
    .filter(Boolean);

  const previewItems = catalog.filter((coffee) => coffee.previewEligible);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + item.lineTotal, 0);

  async function addToCart(coffee, quantity = 1) {
    if (!useServerCart()) {
      setCart((currentCart) => {
        const existing = currentCart.find((entry) => entry.coffee_id === coffee.coffee_id);

        if (existing) {
          return currentCart.map((entry) => (
            entry.coffee_id === coffee.coffee_id
              ? { ...entry, quantity: entry.quantity + quantity }
              : entry
          ));
        }

        return [...currentCart, { coffee_id: coffee.coffee_id, quantity }];
      });
      return;
    }

    const response = await fetch(`${API_URL}/api/cart/items`, {
      method: 'POST',
      headers: authJsonHeaders(),
      body: JSON.stringify({
        coffee_id: coffee.coffee_id,
        quantity,
      }),
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];
    setCart(items.map((item) => ({
      coffee_id: Number(item.coffee_id),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
    })));
  }

  async function updateCartItem(coffeeId, quantity) {
    if (!useServerCart()) {
      setCart((currentCart) => {
        if (quantity <= 0) {
          return currentCart.filter((entry) => entry.coffee_id !== coffeeId);
        }

        return currentCart.map((entry) => (
          entry.coffee_id === coffeeId
            ? { ...entry, quantity }
            : entry
        ));
      });
      return;
    }

    const response = await fetch(`${API_URL}/api/cart/items/${coffeeId}`, {
      method: 'PUT',
      headers: authJsonHeaders(),
      body: JSON.stringify({
        quantity,
      }),
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];
    setCart(items.map((item) => ({
      coffee_id: Number(item.coffee_id),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
    })));
  }

  async function removeFromCart(coffeeId) {
    if (!useServerCart()) {
      setCart((currentCart) => currentCart.filter((entry) => entry.coffee_id !== coffeeId));
      return;
    }

    const response = await fetch(`${API_URL}/api/cart/items/${coffeeId}`, {
      method: 'DELETE',
      headers: authBearerHeaders(),
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];
    setCart(items.map((item) => ({
      coffee_id: Number(item.coffee_id),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
    })));
  }

  async function clearCart() {
    if (!useServerCart()) {
      setCart([]);
      return;
    }

    const response = await fetch(`${API_URL}/api/cart`, {
      method: 'DELETE',
      headers: authBearerHeaders(),
    });
    if (!response.ok) {
      return;
    }

    setCart([]);
  }

  return (
    <ShopContext.Provider
      value={{
        catalog,
        previewItems,
        cartItems,
        cartCount,
        cartSubtotal,
        menuStatus,
        menuError,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error('useShop must be used within a ShopProvider.');
  }

  return context;
}
