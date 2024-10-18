import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext();

// ref: https://blog.logrocket.com/authentication-react-router-v6/
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // call this function when you want to add to cart
  const addToCart = (item) => {
    const old = [...cart, item];
    setCart(old);
  };

  // call this function when you want to remove item from the shopping cart
  const removeFromCart = (item) => {
    const c = cart.filter((i) => i.id !== item.id);
    setCart(c);
  };

  // call this function when you want to clear the shopping cart
  const clear = () => {
    setCart([]);
  };

  // call this function when you want to clear the shopping cart
  const count = () => {
    return cart.length;
  };

  const value = useMemo(
    () => ({
      addToCart,
      removeFromCart,
      clear,
      count,
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};
