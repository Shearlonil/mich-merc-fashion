import { createContext, useContext, useMemo, useState } from "react";
import * as jose from "jose";
import { jwtDecode } from "jwt-decode";
import { useLocalStorage } from "./useLocalStorage";

const CartContext = createContext();

const cartTitle = "cart";
const CART_ACCESS_TOKEN_SECRET =
  "bf5fe8778a915e1d83a5cce053483293894362d4461d40a427ae66171e9ff8e0d65dc39c4cf35590def277f18c9b0147f0a63485da6c9a384ddad145d0cc4d5e";

// ref: https://blog.logrocket.com/authentication-react-router-v6/
export const CartProvider = ({ children }) => {
  const [cartToken, setCartToken] = useLocalStorage(cartTitle, null);

  // call this function when you want to add to cart
  const addToCart = async (item) => {
    try {
      let decoded = decodeToken(cartToken);
      const cartItems = decoded.items;
      //  find item if already exist in cart then update qty else add new to cart
      const found = cartItems.find((i) => i.id == item.id);
      let items;
      if (found) {
        found.qty += item.qty;
        items = [...cartItems];
      } else {
        items = [...cartItems, item];
      }
      // generate new token and save
      const token = await generateToken({ items });
      setCartToken(token);
    } catch (ex) {
      // if no token exist, generate new one
      const items = [item];
      const token = await generateToken({ items });
      setCartToken(token);
    }
  };

  // call this function when you want to update qty of items in the cart
  const updateCart = async (item) => {
    try {
      let decoded = decodeToken(cartToken);
      const cartItems = decoded.items;
      //  find item if already exist in cart then update qty else add new to cart
      const found = cartItems.find((i) => i.id == item.id);
      found.qty = item.qty;
      const items = [...cartItems];
      // generate new token and save
      const token = await generateToken({ items });
      setCartToken(token);
    } catch (error) {
      throw error;
    }
  };

  // call this function when you want to remove item from the shopping cart
  const removeFromCart = async (item) => {
    try {
      let decoded = decodeToken(cartToken);
      const cartItems = decoded.items;
      const items = cartItems.filter((i) => i.id !== item.id);
      // generate new token and save
      const token = await generateToken({ items });
      setCartToken(token);
    } catch (error) {
      throw error;
    }
  };

  // call this function when you want to clear the shopping cart
  const clear = () => {
    setCartToken(null);
  };

  // call this function when you want to get items in the shopping cart
  const getCartItems = () => {
    try {
      let decoded = decodeToken(cartToken);
      return decoded.items;
    } catch (error) {
      return [];
    }
  };

  // call this function when you want to clear the shopping cart
  const count = () => {
    try {
      let decoded = decodeToken(cartToken);
      return decoded.items.reduce(
        (accumulator, currentVal) => accumulator + currentVal.qty,
        0
      );
    } catch (error) {
      return 0;
    }
  };

  /*  for working with jose as the jwt, see https://stackoverflow.com/questions/70855672/cant-use-jsonwebtoken-with-latest-version-of-react*/
  const generateToken = async (payload) => {
    try {
      const secret = new TextEncoder().encode(CART_ACCESS_TOKEN_SECRET);
      const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        // .setExpirationTime(new Date().getTime() + parseInt(JWT_EXPIRY))
        .sign(secret);
      return jwt;
    } catch (error) {
      throw error;
    }
  };

  const decodeToken = (token) => {
    try {
      const jwt = jose.decodeJwt(token);
      return jwt;
    } catch (error) {
      throw error;
    }
  };

  const verifyToken = async (token) => {
    try {
      const secret = new TextEncoder().encode(CART_ACCESS_TOKEN_SECRET);
      return await jose.jwtVerify(token, secret);
    } catch (error) {
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      addToCart,
      updateCart,
      removeFromCart,
      clear,
      getCartItems,
      count,
    }),
    [cartToken]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};
