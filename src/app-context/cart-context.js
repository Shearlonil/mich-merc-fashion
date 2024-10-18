import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext();

// ref: https://blog.logrocket.com/authentication-react-router-v6/
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // call this function when you want to add to cart
  const addToCart = async (loginDetails) => {
    setJwtToken(jwt);
  };

  // call this function when you want to remove item from the shopping cart
  const removeFromCart = async () => {
    setJwtToken(jwt);
  };

  // call this function when you want to clear the shopping cart
  const clear = async () => {
    setCart([]);
  };

  const value = useMemo(
    () => ({
      addToCart,
      removeFromCart,
      clear,
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useAuth = () => {
  return useContext(CartContext);
};
