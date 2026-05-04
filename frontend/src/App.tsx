// @ts-nocheck
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./app/context/AuthContext";
import { CartProvider } from "./app/context/CartContext";
import { ProductProvider } from "./app/context/ProductContext";

import { Header } from "./app/components/Header";

import Home from "./pages/Home";
import { Login } from "./pages/Login";
import Burgers from "./pages/Burgers";
import Dogs from "./pages/Dogs";
import Sides from "./pages/Sides";
import { Combos } from "./pages/Combos";
import { Drinks } from "./pages/Drinks";
import { ProductDetails } from "./pages/ProductDetails";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/burgers" element={<Burgers />} />
            <Route path="/dogs" element={<Dogs />} />
            <Route path="/sides" element={<Sides />} />
            <Route path="/combos" element={<Combos />} />
            <Route path="/drinks" element={<Drinks />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;
