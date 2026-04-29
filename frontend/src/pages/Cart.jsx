import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { cartUpsells, formatPrice } from '../data/shopData';
import { useScrollReveal } from '../hooks/useScrollReveal';

function CartPage() {
  const {
    cartItems,
    cartSubtotal,
    clearCart,
    removeFromCart,
    updateCartItem,
  } = useShop();
  const revealRef = useScrollReveal();

  return (
    <main ref={revealRef} className="oc-page oc-cart">
      <section className="cart-manifest" data-reveal>
        <div className="cart-manifest__speedlines" />
        <h1>THE CAPTAIN&apos;S MANIFEST</h1>

        {cartItems.length === 0 ? (
          <div className="manifest-empty">
            <p>Your cart is calm seas right now. Head back to the menu and load it up with something legendary.</p>
            <Link to="/menu">Browse The Drinks</Link>
          </div>
        ) : (
          <div className="manifest-list">
            {cartItems.map((item, index) => (
              <article key={item.coffee_id} className="manifest-item" data-reveal data-reveal-delay={index * 70}>
                <div className="manifest-thumb">
                  {item.drinkImage ? (
                    <img src={item.drinkImage} alt={item.drinkAlt} />
                  ) : (
                    <img src="/onecafe-assets/logos/straw-hat-jolly-roger.png" alt="" />
                  )}
                  <span>{index + 1}</span>
                </div>
                <div className="manifest-copy">
                  <h2>{item.name}</h2>
                  <p>{item.displayDescription ?? item.description}</p>
                  <div className="manifest-controls">
                    <button type="button" onClick={() => updateCartItem(item.coffee_id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`}>
                      -
                    </button>
                    <strong>{item.quantity}</strong>
                    <button type="button" onClick={() => updateCartItem(item.coffee_id, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`}>
                      +
                    </button>
                  </div>
                  <b>{formatPrice(item.lineTotal)}</b>
                </div>
                <div className="manifest-actions">
                  <button type="button" onClick={() => removeFromCart(item.coffee_id)}>REMOVE</button>
                  <span>{item.priceLabel} each</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="cart-checkout" data-reveal>
        <img src="/onecafe-assets/backgrounds/comic-checkout-explosion.png" alt="" />
        <div className="cart-checkout__panel">
          <h2>READY TO CHECK OUT</h2>
          <p>{cartItems.length} drinks packed for the voyage.</p>
          <strong>{formatPrice(cartSubtotal)}</strong>
          <div className="cart-checkout__actions">
            <Link to="/menu">Keep Shopping</Link>
            <button type="button" onClick={clearCart}>Clear Cart</button>
          </div>
        </div>
        <p className="cart-checkout__sfx cart-checkout__sfx--left">ドン!!</p>
        <p className="cart-checkout__sfx cart-checkout__sfx--right">バン!!</p>
      </section>

      <section className="cart-upsell" data-reveal>
        <h2>REPLENISH THE STORES</h2>
        <div className="upsell-grid">
          {cartUpsells.map((item, index) => (
            <article key={item.name} className="upsell-card" data-reveal data-reveal-delay={index * 80}>
              <img src={item.image} alt={item.name} />
              <div className="upsell-card__body">
                <h3>{item.name}</h3>
                <p>{item.note}</p>
                <strong>{item.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default CartPage;
