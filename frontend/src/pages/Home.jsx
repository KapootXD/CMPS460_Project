import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { homePreviewPanels } from '../data/shopData';
import { useScrollReveal } from '../hooks/useScrollReveal';

const reviews = [
  {
    quote: 'BEST COFFEE ON THE GRAND LINE!',
    name: 'Captain X',
    role: 'Captain X',
    tone: 'red',
  },
  {
    quote: 'ENERGIZES ME FOR ANY BATTLE!',
    name: 'Swordsman Y',
    role: 'Swordsman Y',
    tone: 'yellow',
  },
  {
    quote: 'I FOUND MY TREASURE IN A CUP!',
    name: 'Navigator Z',
    role: 'Navigator Z',
    tone: 'green',
  },
];

const specialPosterImage = '/onecafe-assets/specials/gomu-gomu-punch-poster.png';

function getPanelsPerView() {
  if (typeof window === 'undefined') {
    return 5;
  }

  if (window.innerWidth <= 680) {
    return 1;
  }

  if (window.innerWidth <= 980) {
    return 2;
  }

  if (window.innerWidth <= 1280) {
    return 3;
  }

  return 5;
}

function HomePage() {
  const { catalog } = useShop();
  const revealRef = useScrollReveal();
  const special = catalog.find((item) => item.name === 'Gomu Gomu No... Punch!');
  const [previewStart, setPreviewStart] = useState(0);
  const [panelsPerView, setPanelsPerView] = useState(getPanelsPerView);

  useEffect(() => {
    function handleResize() {
      setPanelsPerView(getPanelsPerView());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visiblePanels = Array.from({ length: panelsPerView }, (_, offset) => (
    homePreviewPanels[(previewStart + offset) % homePreviewPanels.length]
  ));

  function previousPreview() {
    setPreviewStart((current) => (current - 1 + homePreviewPanels.length) % homePreviewPanels.length);
  }

  function nextPreview() {
    setPreviewStart((current) => (current + 1) % homePreviewPanels.length);
  }

  return (
    <main ref={revealRef} className="oc-page oc-home">
      <section className="home-hero" data-reveal>
        <img className="home-hero__single-image" src="/onecafe-assets/characters/home-hero-crew-clean.png" alt="Straw Hat crew at OneCafe" />
        <div className="home-hero__overlay">
          <img className="home-hero__logo" src="/onecafe-assets/logos/onecafe-wordmark-hero.png" alt="OneCafe" />
          <div className="home-hero__actions">
            <Link to="/menu">EXPLORE THE MENU ⚓</Link>
            <Link to="/signup">JOIN THE CREW ❤️</Link>
          </div>
        </div>
      </section>

      <section className="home-punch" data-reveal>
        <img className="home-punch__bg home-punch__bg--poster" src={specialPosterImage} alt="Gomu Gomu No... Punch comic poster" />
        <div className="home-punch__overlay">
          <p className="home-punch__tag">{special?.themeLine ?? 'LIMITED GRAND LINE SPECIAL'}</p>
          <Link className="home-punch__buy" to="/menu#special-drink">
            BUY THIS DRINK
          </Link>
        </div>
      </section>

      <section className="home-menu-preview" data-reveal>
        <h2>MENU PREVIEW</h2>
        <p>Flip through the manga-style preview boards before you hit the full menu.</p>
        <div className="preview-carousel">
          <button type="button" className="preview-carousel__arrow preview-carousel__arrow--left" onClick={previousPreview} aria-label="Show previous menu preview panels">
            ‹
          </button>
          <div className="preview-grid">
            {visiblePanels.map((panel) => (
              <article key={`${panel.id}-${previewStart}`} className="preview-card preview-card--panel-only">
                <div className="preview-card__panel">
                  <img src={panel.image} alt={panel.alt} />
                  {panel.bubbleText && panel.bubbleClass ? (
                    <p className={`preview-card__panel-copy ${panel.bubbleClass}`}>{panel.bubbleText}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          <button type="button" className="preview-carousel__arrow preview-carousel__arrow--right" onClick={nextPreview} aria-label="Show next menu preview panels">
            ›
          </button>
        </div>
        <div className="preview-carousel__dots" aria-label="Menu preview positions">
          {homePreviewPanels.map((panel, index) => (
            <button
              key={panel.id}
              type="button"
              className={index === previewStart ? 'is-active' : ''}
              onClick={() => setPreviewStart(index)}
              aria-label={`Go to preview ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="home-voyage" id="voyage" data-reveal>
        <div className="home-voyage__inner">
          <h2>OUR VOYAGE</h2>
          <div className="voyage-banner">
            <img src="/onecafe-assets/backgrounds/voyage-sunset-harbor.png" alt="OneCafe harbor voyage scene" />
            <div className="voyage-banner__notes">
              <article className="voyage-note voyage-note--origin">
                OneCafe began as a tiny dockside brew stand run by dreamers who loved adventure and great coffee.
                We blended island bean traditions with comic-book energy to create a place where every cup feels like
                the start of a new journey.
              </article>
              <article className="voyage-note voyage-note--flavor">
                We craft every drink for flavor first: rich aromas, smooth finish, and bold character in every sip.
                From bright citrus brews to deep roasted specials, every recipe is tuned to feel legendary.
              </article>
              <article className="voyage-note voyage-note--harbor">
                Our harbor cafe was built to be a crew stop between adventures: warm seats, good stories, and a cup
                that always tastes like home.
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="home-fame" data-reveal>
        <div className="home-fame__inner">
          <h2>WALL OF FAME</h2>
          <div className="fame-summary" data-reveal>
            <p className="fame-summary__sfx">AHOY!</p>
            <div className="fame-summary__burst">
              <strong>428</strong>
              <span>5-Star Reviews</span>
            </div>
            <p className="fame-summary__sfx">KA-CHING</p>
          </div>
          <div className="fame-row">
            {reviews.map((review, index) => (
              <article
                key={review.name}
                className={`review-card review-card--${review.tone}`}
                data-reveal
                data-reveal-delay={index * 100}
              >
                <div className="review-card__bubble">
                  <blockquote>{review.quote}</blockquote>
                  <p className="review-meta">- {review.name}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
