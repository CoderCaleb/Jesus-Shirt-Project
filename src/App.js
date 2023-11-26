import { Outlet, Route, Routes } from "react-router-dom"
import React, {useState, createContext, useEffect} from 'react'
import SideBar from "./components/SideBar"
import Cart from "./components/Cart"
import Homepage from "./components/Homepage"
import Shop from "./components/Shop"
import Product from "./components/Product"
import RemoveItemModal from "./modals/removeItemModal"
export const StateSharingContext = createContext()

export default function App() {
  const [cartItems, setCartItems] = useState([])
  const [showRemoveItem, setShowRemoveItem] = useState({})

  const stateContextValue = {cartItems,setCartItems,showRemoveItem, setShowRemoveItem}
  useEffect(()=>{
    console.log(showRemoveItem)
  },[showRemoveItem])
  return (
    <StateSharingContext.Provider value={stateContextValue}>
    <div className="w-screen h-screen bg-background flex">
      <HandleModalComponent/>
      <Routes>
        <Route path="/" element={<Outlet/>} errorElement={<h1>404</h1>}></Route>
          <Route index element={<Homepage/>}/>
          <Route path="cart" element={<div className="flex w-full h-full"><SideBar/><Cart/></div>}/>
          <Route path="shop" element={<Outlet/>}>
            <Route index element={<div className="flex w-full h-full"><SideBar/><Shop/></div>}/>
            <Route path=":productId" element={<div className="flex w-full h-full"><SideBar/><Product/></div>}/>
          </Route>
        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </div>
    </StateSharingContext.Provider>
  )

  function HandleModalComponent(){
    return(
      <div>
        {showRemoveItem.state?<RemoveItemModal productData={showRemoveItem.productData}/>:<></>}
      </div>
    )
  }
}