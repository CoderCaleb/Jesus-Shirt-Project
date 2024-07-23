// components/Modal.js
import React from 'react';

const Modal = ({ title, content, actions, open }) => {
  const modalContainerStyle =
    "absolute w-full h-[calc(100vh-64px)] flex justify-center items-center bg-darkenBg z-50";
  const modalContentStyle =
    "flex flex-col p-6 bg-background rounded-md shadow-md shadow-slate-600";
  const buttonBaseStyle = "flex-1 h-10 font-semibold rounded-md";

  if(!open){
    return null
  }

  return (
    <div className={modalContainerStyle}>
      <div className={modalContentStyle}>
        <div>{title}</div>
        <div className="mt-3">{content}</div>
        <div className="flex gap-3 mt-4">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`${buttonBaseStyle} ${action.className}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
