'use client'

import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface CheckoutContextType {
  checkoutProgress: number;
  setCheckoutProgress: Dispatch<SetStateAction<number>>;
  emailAddress: string;
  setEmailAddress: Dispatch<SetStateAction<string>>;
  cartItems: any[];
  setCartItems: Dispatch<SetStateAction<any[]>>;
  checkoutItems: any[];
  setCheckoutItems: Dispatch<SetStateAction<any[]>>;
  clientSecret: string;
  setClientSecret: Dispatch<SetStateAction<string>>;
  paymentIntentId: string;
  setPaymentIntentId: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  shippingData: Record<string, any>;
  setShippingData: Dispatch<SetStateAction<Record<string, any>>>;
  orderNumber: string;
  setOrderNumber: Dispatch<SetStateAction<string>>;
  checkoutConfirmData: Record<string, any>;
  setCheckoutConfirmData: Dispatch<SetStateAction<Record<string, any>>>;
}

export const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

interface CheckoutContextProviderProps {
  children: ReactNode;
}

export const CheckoutContextProvider = ({ children }: CheckoutContextProviderProps) => {
  const [checkoutProgress, setCheckoutProgress] = useState<number>(1);
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shippingData, setShippingData] = useState<Record<string, any>>({});
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [checkoutConfirmData, setCheckoutConfirmData] = useState<Record<string, any>>({});

  const value = {
    checkoutProgress,
    setCheckoutProgress,
    emailAddress,
    setEmailAddress,
    cartItems,
    setCartItems,
    checkoutItems,
    setCheckoutItems,
    clientSecret,
    setClientSecret,
    paymentIntentId,
    setPaymentIntentId,
    isLoading,
    setIsLoading,
    shippingData,
    setShippingData,
    orderNumber,
    setOrderNumber,
    checkoutConfirmData,
    setCheckoutConfirmData,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};
