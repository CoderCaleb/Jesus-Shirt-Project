// components/RemoveItemModal.js
import React, { useContext } from "react";
import { FiTrash } from "react-icons/fi";
import { StateSharingContext } from "../contexts";
import Modal from "./Modal";

export default function RemoveItemModal({ productData }) {
  const { name } = productData;
  const { setShowRemoveItem, setCartItems, showRemoveItem } = useContext(StateSharingContext);

  const handleRemoveItem = () => {
    setCartItems((prev) => prev.filter((item) => item !== productData));
    setShowRemoveItem({ state: false, productData: "" });
  };

  const handleCloseModal = () => {
    setShowRemoveItem({ state: false, productData: "" });
  };

  const title = (
    <div className="flex items-center gap-2">
      <FiTrash size={30} />
      <p className="text-xl font-bold">Remove Item</p>
    </div>
  );

  const content = (
    <p className="text-sm text-slate-600 text-center">
      Do you want to remove <span className="font-semibold">{name}</span> from cart?
    </p>
  );

  const actions = [
    {
      label: "Remove",
      className: "border-2 text-sm border-black bg-black text-white hover:bg-white hover:text-black",
      onClick: handleRemoveItem,
    },
    {
      label: "Cancel",
      className: "border-2 border-gray-300",
      onClick: handleCloseModal,
    },
  ];

  return (
    <Modal
      title={title}
      content={content}
      actions={actions}
      open={showRemoveItem.state}
    />
  );
}
