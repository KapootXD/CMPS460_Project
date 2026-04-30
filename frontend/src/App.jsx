import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import { ShopProvider } from './context/ShopContext';
import CartPage from './pages/Cart';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import MenuPage from './pages/Menu';
import CheckoutPage from './pages/Checkout';
import ReportActiveCartItems from './pages/ReportActiveCartItems';
import ReportAvailableCoffees from './pages/ReportAvailableCoffees';
import ReportCoffeesUnderFive from './pages/ReportCoffeesUnderFive';
import SignupPage from './pages/Signup';

function App() {
  return (
    <ShopProvider>
      <Routes>
        <Route
          path="/"
          element={(
            <SiteLayout brand="onecafe" active="home">
              <HomePage />
            </SiteLayout>
          )}
        />
        <Route
          path="/menu"
          element={(
            <SiteLayout brand="onecafe" active="menu">
              <MenuPage />
            </SiteLayout>
          )}
        />
        <Route
          path="/login"
          element={(
            <SiteLayout brand="onecafe" active="login">
              <LoginPage />
            </SiteLayout>
          )}
        />
        <Route
          path="/signup"
          element={(
            <SiteLayout brand="onecafe" active="signup">
              <SignupPage />
            </SiteLayout>
          )}
        />
        <Route
          path="/cart"
          element={(
            <SiteLayout brand="onecafe" active="cart">
              <CartPage />
            </SiteLayout>
          )}
        />
        <Route
          path="/checkout/:checkoutId"
          element={(
            <SiteLayout brand="onecafe" active="cart">
              <CheckoutPage />
            </SiteLayout>
          )}
        />
        <Route
          path="/reports/available-coffees"
          element={(
            <SiteLayout brand="onecafe" active="reports">
              <ReportAvailableCoffees />
            </SiteLayout>
          )}
        />
        <Route
          path="/reports/coffees-under-five"
          element={(
            <SiteLayout brand="onecafe" active="reports">
              <ReportCoffeesUnderFive />
            </SiteLayout>
          )}
        />
        <Route
          path="/reports/active-cart-items"
          element={(
            <SiteLayout brand="onecafe" active="reports">
              <ReportActiveCartItems />
            </SiteLayout>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ShopProvider>
  );
}

export default App;
