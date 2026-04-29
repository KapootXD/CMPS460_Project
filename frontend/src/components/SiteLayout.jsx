import Footer from './Footer';
import Navbar from './Navbar';

function SiteLayout({ children, brand, active }) {
  return (
    <div className="oc-site">
      <Navbar brand={brand} active={active} />
      {children}
      <Footer />
    </div>
  );
}

export default SiteLayout;
