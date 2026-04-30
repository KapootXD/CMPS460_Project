import { Link } from 'react-router-dom';

const reportLinks = [
  {
    key: 'available',
    label: 'Available Coffees',
    to: '/reports/available-coffees',
  },
  {
    key: 'under-five',
    label: 'Under $5',
    to: '/reports/coffees-under-five',
  },
  {
    key: 'active-cart-items',
    label: 'Active Cart Items',
    to: '/reports/active-cart-items',
  },
];

function ReportShell({
  title,
  subtitle,
  active,
  children,
}) {
  return (
    <main className="oc-page oc-reports">
      <section className="reports-hero">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div className="reports-links">
          {reportLinks.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              className={active === link.key ? 'is-active' : ''}
              aria-current={active === link.key ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
      <section className="reports-content">
        {children}
      </section>
    </main>
  );
}

export default ReportShell;
