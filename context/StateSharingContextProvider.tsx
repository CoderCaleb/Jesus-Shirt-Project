'use client'

import { createContext, useState, ReactNode } from 'react';
import { Dispatch, SetStateAction } from 'react';

interface ModalState {
  state: boolean;
  productData?: string; // productData is optional
}

interface StateSharingContextType {
  cartItems: any[];
  setCartItems: Dispatch<SetStateAction<any[]>>;

  showRemoveItem: ModalState;
  setShowRemoveItem: Dispatch<SetStateAction<ModalState>>;

  showReauthenticateModal: ModalState;
  setShowReauthenticateModal: Dispatch<SetStateAction<ModalState>>;

  showChangePasswordModal: ModalState;
  setShowChangePasswordModal: Dispatch<SetStateAction<ModalState>>;

  sendVerificationEmailModal: ModalState;
  setSendVerificationEmailModal: Dispatch<SetStateAction<ModalState>>;

  user: any;
  setUser: Dispatch<SetStateAction<any>>;

  userInfo: any;
  setUserInfo: Dispatch<SetStateAction<any>>;
}

export const StateSharingContext = createContext<StateSharingContextType | undefined>(undefined);

interface StateSharingContextProviderProps {
  children: ReactNode;
}

export const StateSharingContextProvider = ({ children }: StateSharingContextProviderProps) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  
  // Initialize showRemoveItem with productData field
  const [showRemoveItem, setShowRemoveItem] = useState<ModalState>({
    state: false,
    productData: "",  // This is expected for the initial state
  });
  
  // Other modals with only state field, productData is optional
  const [showReauthenticateModal, setShowReauthenticateModal] = useState<ModalState>({
    state: false,
  });

  const [showChangePasswordModal, setShowChangePasswordModal] = useState<ModalState>({
    state: false,
  });

  const [sendVerificationEmailModal, setSendVerificationEmailModal] = useState<ModalState>({
    state: false,
  });

  const [user, setUser] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const value = {
    cartItems,
    setCartItems,
    showRemoveItem,
    setShowRemoveItem,
    showReauthenticateModal,
    setShowReauthenticateModal,
    showChangePasswordModal,
    setShowChangePasswordModal,
    sendVerificationEmailModal,
    setSendVerificationEmailModal,
    user,
    setUser,
    userInfo,
    setUserInfo,
  };

  return (
    <StateSharingContext.Provider value={value}>
      {children}
    </StateSharingContext.Provider>
  );
};
