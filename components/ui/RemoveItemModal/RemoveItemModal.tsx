import React from "react";
import { FiTrash } from "react-icons/fi";
import Modal from "@/components/ui/Modal";
import { useCartContext } from "@/context/CartContextProvider";
import { CartData } from "@/types/product";

interface RemoveItemModalProps {
  productData?: CartData;
}

const RemoveItemModal: React.FC<RemoveItemModalProps> = ({ productData }) => {
  const { name = "" } = productData!;
  const { setCartItems, setIsRemoveItemModalOpen, isRemoveItemModalOpen } =
    useCartContext();

  const handleRemoveItem = () => {
    setCartItems((prev) => prev.filter((item) => item !== productData));
    setIsRemoveItemModalOpen({ state: false, productData: undefined });
  };

  const handleCloseModal = () => {
    setIsRemoveItemModalOpen({ state: false, productData: undefined });
  };

  const title = (
    <div className="flex items-center gap-2">
      <FiTrash size={30} />
      <p className="text-xl font-bold">Remove Item</p>
    </div>
  );

  const content = (
    <p className="text-sm text-slate-600 text-center">
      Do you want to remove <span className="font-semibold">{name}</span> from
      cart?
    </p>
  );

  const actions = [
    {
      label: "Remove",
      className:
        "border-2 text-sm border-black bg-black text-white hover:bg-white hover:text-black",
      onClick: handleRemoveItem,
    },
    {
      label: "Cancel",
      className: "border-2 border-gray-300",
      onClick: handleCloseModal,
    },
  ];
  if (!productData) {
    return null;
  }

  return (
    <Modal
      title={title}
      content={content}
      actions={actions}
      open={isRemoveItemModalOpen.state}
    />
  );
};

export default RemoveItemModal;
