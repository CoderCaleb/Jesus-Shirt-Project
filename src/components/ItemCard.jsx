import React from 'react'

export default function ItemCard(props) {
    const { productInfo } = props;
    return (
      <div className="flex w-full justify-between p-6 gap-3 items-center">
        <div className="flex gap-3 items-center">
          <div className="w-16 h-16 min-w-[4rem] min-h-[4rem] relative border-1 border-slate-300 bg-slate-300 rounded-lg p-1 flex items-center justify-center">
            <img
              alt="item"
              src={require(`../images/${productInfo.image}`)}
              className="w-full h-full"
            />
            <div className="absolute bg-black rounded-3xl w-5 h-5 flex items-center justify-center text-white font-semibold text-sm -top-1 -left-1">
              <p>{productInfo.quantity}</p>
            </div>
          </div>
          <div className="text-sm font-semibold">
            <p>{productInfo.name}</p>
            <p className="text-slate-500"><span className='sm:hidden'>{"$" + productInfo.price + " / "}</span>{`${productInfo.size}`}</p>
          </div>
        </div>
        <div className="font-semibold hidden sm:block">
          <p>{"$" + productInfo.price}</p>
        </div>
      </div>
    );
  }

