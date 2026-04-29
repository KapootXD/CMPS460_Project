import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

function Navbar({ brand = 'onecafe', active = 'home' }) {
  const { cartCount } = useShop();
  const brandSrc = '/onecafe-assets/logos/onecafe-wordmark-hero.png';

  return (
    <header className="oc-nav">
      <div className="oc-nav__inner">
        <Link to="/" className="oc-nav__brand" aria-label="OneCafe home">
          <img src={brandSrc} alt="OneCafe" />
        </Link>
        <nav className="oc-nav__links" aria-label="Primary navigation">
          <Link to="/" className={active === 'home' ? 'is-active' : ''}>HOME</Link>
          <Link to="/menu" className={active === 'menu' ? 'is-active' : ''}>MENU</Link>
          <Link to={active === 'signup' ? '/login' : '/signup'} className={active === 'login' || active === 'signup' ? 'is-active' : ''}>
            {active === 'signup' ? 'LOGIN' : 'SIGNUP'}
          </Link>
        </nav>
        <Link to="/cart" className="oc-nav__cart">
          Cart <span aria-hidden="true">🛒</span>
          <span className="oc-nav__cart-count" aria-label={`${cartCount} items in cart`}>
            {cartCount}
          </span>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
