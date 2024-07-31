import { createContext, useEffect, useReducer, useState } from "react";
import ShoppingCart from "../components/ShoppingCart";

const initialCartItems = localStorage.getItem("shopping-cart")
  ? JSON.parse(localStorage.getItem("shopping-cart"))
  : [];

const INCREASE_CART_QUANTITY = "increase_cart_quantity";
const DECREASE_CART_QUANTITY = "decrease_cart_quantity";
const REMOVE_CART_ITEM = "remove_cart_item";

const reducer = (state, action) => {
  switch (action.type) {
    case INCREASE_CART_QUANTITY:
      if (
        state.cartItems.find((items) => items.id === action.payload) == null
      ) {
        return {
          ...state,
          cartItems: [...state.cartItems, { id: action.payload, quantity: 1 }],
        };
      } else {
        return {
          ...state,
          cartItems: state.cartItems.map((item) => {
            if (item.id === action.payload) {
              return { ...item, quantity: item.quantity + 1 };
            } else {
              return item;
            }
          }),
        };
      }
    case DECREASE_CART_QUANTITY:
      if (
        state.cartItems.find((items) => items.id === action.payload) == null
      ) {
        return {
          ...state,
          cartItems: state.cartItems.filter(
            (items) => items.id !== action.payload
          ),
        };
      } else {
        return {
          ...state,
          cartItems: state.cartItems.map((item) => {
            if (item.id === action.payload) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              return item;
            }
          }),
        };
      }
    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (items) => items.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

function ShoppingCartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    cartItems: initialCartItems,
  });

  useEffect(() => {
    localStorage.setItem("shopping-cart", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const cartQuantity = state.cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const closeCart = () => {
    setIsOpen(false);
  };

  const openCart = () => {
    setIsOpen(true);
  };

  const getItemQuantity = (id) => {
    return state.cartItems.find((items) => items.id === id)?.quantity || 0;
  };

  const increaseCartQuantity = (id) => {
    dispatch({
      type: INCREASE_CART_QUANTITY,
      payload: id,
    });
  };

  const decreaseCartQuantity = (id) => {
    dispatch({
      type: DECREASE_CART_QUANTITY,
      payload: id,
    });
  };

  const removeCartItem = (id) => {
    dispatch({
      type: REMOVE_CART_ITEM,
      payload: id,
    });
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        state,
        cartQuantity,
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeCartItem,
        closeCart,
        openCart,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}

export const ShoppingCartContext = createContext();

export default ShoppingCartProvider;
