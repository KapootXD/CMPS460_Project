import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import { ShopProvider } from './context/ShopContext';
import CartPage from './pages/Cart';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import MenuPage from './pages/Menu';
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ShopProvider>
  );
}

export default App;
