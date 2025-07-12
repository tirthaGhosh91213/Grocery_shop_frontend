import { createContext } from "react";

export const CartContext = createContext({
  cart : [],
  setToCart : () => {}
})

export const SearchContext = createContext();