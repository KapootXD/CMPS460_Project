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
} from '../data/shopData';

const CART_STORAGE_KEY = 'onecafe-cart-v1';

const ShopContext = createContext(null);

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
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

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
        lineTotal: Number(catalogItem.price) * entry.quantity,
      };
    })
    .filter(Boolean);

  const previewItems = catalog.filter((coffee) => coffee.previewEligible);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + item.lineTotal, 0);

  function addToCart(coffee, quantity = 1) {
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
  }

  function updateCartItem(coffeeId, quantity) {
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
  }

  function removeFromCart(coffeeId) {
    setCart((currentCart) => currentCart.filter((entry) => entry.coffee_id !== coffeeId));
  }

  function clearCart() {
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
