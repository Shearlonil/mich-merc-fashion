import { createContext, useContext, useMemo, useState } from "react";
import * as jose from "jose";
import { useLocalStorage } from "./useLocalStorage";
import { fromUnixTime, differenceInMinutes } from "date-fns";

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
      let decoded = await decodeToken();
      const result = differenceInMinutes(
        new fromUnixTime(decoded.exp),
        new Date()
      );
      const cartItems = decoded.items;
      //  find item if already exist in cart then update qty else add new to cart
      const found = cartItems.find((i) => i.id === item.id);
      let items;
      if (found) {
        found.qty += item.qty;
        items = [...cartItems];
      } else {
        items = [...cartItems, item];
      }
      // generate new token and save
      const token = await generateToken({ items }, `${result}m`);
      setCartToken(token);
    } catch (ex) {
      // if no token exist or exp token, generate new one
      const items = [item];
      const token = await generateToken({ items }, "1440m"); //1440m is a day
      setCartToken(token);
    }
  };

  // call this function when you want to update qty of items in the cart
  const updateCart = async (item) => {
    try {
      let decoded = await decodeToken();
      const result = differenceInMinutes(
        new fromUnixTime(decoded.exp),
        new Date()
      );
      const cartItems = decoded.items;
      //  find item if already exist in cart then update qty else add new to cart
      const found = cartItems.find((i) => i.id == item.id);
      found.qty = item.qty;
      const items = [...cartItems];
      // generate new token and save
      const token = await generateToken({ items }, `${result}m`);
      setCartToken(token);
    } catch (error) {
      throw error;
    }
  };

  // call this function when you want to remove item from the shopping cart
  const removeFromCart = async (item) => {
    try {
      let decoded = await decodeToken();
      const result = differenceInMinutes(
        new fromUnixTime(decoded.exp),
        new Date()
      );
      const cartItems = decoded.items;
      const items = cartItems.filter((i) => i.id !== item.id);
      // generate new token and save
      const token = await generateToken({ items }, `${result}m`);
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
  const getCartItems = async () => {
    try {
      if (cartToken != null) {
        let decoded = await decodeToken();
        return decoded.items;
      } else {
        throw new Error("Cart item is null");
      }
    } catch (error) {
      clear();
      throw error;
    }
  };

  // call this function when you want to clear the shopping cart
  const count = async () => {
    try {
      if (cartToken != null) {
        let decoded = await decodeToken();
        return decoded.items.reduce(
          (accumulator, currentVal) => accumulator + currentVal.qty,
          0
        );
      } else {
        throw new Error("Null");
      }
    } catch (error) {
      // don't clear and throw error here because count is mostly used by navbar which should show 0 no matter what
      return 0;
    }
  };

  /*  for working with jose as the jwt, see https://stackoverflow.com/questions/70855672/cant-use-jsonwebtoken-with-latest-version-of-react*/
  const generateToken = async (payload, exp) => {
    try {
      const secret = new TextEncoder().encode(CART_ACCESS_TOKEN_SECRET);
      const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(exp)
        .sign(secret);
      return jwt;
    } catch (error) {
      throw error;
    }
  };

  const decodeToken = async () => {
    /*  The expiration time in a JWT is represented in epoch timestamp format, also known as Unix time, which is a widely used date and time representation in computing. It measures time by counting the number of non-leap seconds that have passed since 00:00:00 UTC on January 1, 1970, known as the Unix epoch.
        We can convert it to milliseconds by multiplying by 1000 and passing as args to JS Date obj
        new Date(unix_timestampunix_timestamp * 1000)

        ref:
        https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
        https://stackoverflow.com/questions/39926104/what-format-is-the-exp-expiration-time-claim-in-a-jwt
    */
    try {
      const tokenObj = await verifyToken(cartToken);
      return tokenObj.payload;
    } catch (error) {
      throw error;
    }
  };

  const verifyToken = async () => {
    try {
      const secret = new TextEncoder().encode(CART_ACCESS_TOKEN_SECRET);
      if (cartToken == "null") {
        /*  for some reasons not clear, cartToken === null or cartToken == null isn't working. Reason 
            null is a string here
        */
        return null;
      }
      return await jose.jwtVerify(cartToken, secret);
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
