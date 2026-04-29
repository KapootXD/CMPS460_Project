function Footer() {
  return (
    <footer className="oc-footer">
      <div className="oc-footer__watermark oc-footer__watermark--left" />
      <div className="oc-footer__watermark oc-footer__watermark--center" />
      <div className="oc-footer__watermark oc-footer__watermark--right" />
      <div className="oc-footer__inner">
        <div>
          <strong>OneCafe</strong>
          <p>© 1622 Grand Line Roastery - All Rights Reserved</p>
        </div>
        <div className="oc-footer__admin">
          <a href="#admin-login">Admin Login</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
