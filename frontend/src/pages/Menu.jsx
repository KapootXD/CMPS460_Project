import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

function MenuPage() {
  const {
    addToCart,
    cartItems,
    catalog,
    updateCartItem,
  } = useShop();
  const revealRef = useScrollReveal();

  function getQuantityInCart(coffeeId) {
    return cartItems.find((item) => item.coffee_id === coffeeId)?.quantity ?? 0;
  }

  return (
    <main ref={revealRef} className="oc-page oc-menu">
      <section className="menu-hero">
        <img src="/onecafe-assets/backgrounds/comic-burst-blue.png" alt="" />
        <h1>GRAND LINE MENU</h1>
        <p className="menu-hero__copy">
          Big flavors, bright blends, and crew-favorite drinks packed with enough punch to make
          every stop on the voyage worth it.
        </p>
        <p className="menu-hero__sfx menu-hero__sfx--left">ドン!!</p>
        <p className="menu-hero__sfx menu-hero__sfx--right">バン!!</p>
      </section>

      <section className="menu-content" data-reveal>
        <div className="menu-content__bg" />

        <div className="drink-grid">
          {catalog.map((coffee, index) => {
            const quantityInCart = getQuantityInCart(coffee.coffee_id);

            return (
              <article
                key={coffee.coffee_id}
                id={coffee.name === 'Gomu Gomu No... Punch!' ? 'special-drink' : undefined}
                className={`drink-card drink-card--${coffee.accent}`}
                data-reveal
                data-reveal-delay={index * 60}
              >
                <div className="drink-card__art">
                  {coffee.drinkImage ? (
                    <img src={coffee.drinkImage} alt={coffee.drinkAlt} />
                  ) : (
                    <div className="drink-card__fallback-art">
                      <img src="/onecafe-assets/logos/straw-hat-jolly-roger.png" alt="" />
                    </div>
                  )}
                </div>

                <div className="drink-card__body">
                  <p className="drink-card__eyebrow">{coffee.themeLine}</p>
                  <h3>{coffee.name}</h3>
                  <p>{coffee.displayDescription ?? coffee.description}</p>
                  <div className="drink-card__footer">
                    <strong>{coffee.priceLabel}</strong>
                    {quantityInCart > 0 ? (
                      <div className="drink-card__quantity">
                        <button type="button" onClick={() => updateCartItem(coffee.coffee_id, quantityInCart - 1)} aria-label={`Remove one ${coffee.name}`}>
                          -
                        </button>
                        <span>{quantityInCart} in cart</span>
                        <button type="button" onClick={() => updateCartItem(coffee.coffee_id, quantityInCart + 1)} aria-label={`Add one more ${coffee.name}`}>
                          +
                        </button>
                      </div>
                    ) : (
                      <button type="button" className="drink-card__buy" onClick={() => addToCart(coffee)}>
                        Buy This Drink
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="menu-callout" data-reveal>
          <img src="/onecafe-assets/fillers/manga-coffee-action-panel.png" alt="" />
          <div className="menu-callout__bubble">
            <h3>Every drink hits big, bold, and delicious.</h3>
            <p>
              From sweet Sakura frappes to sharp citrus coolers and rich dark roasts, these cups
              are made to pop on the page and taste like the treasure at the end of the voyage.
              When you&apos;re ready, head to the cart and claim your favorites.
            </p>
            <Link to="/cart">Head To Cart</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MenuPage;
