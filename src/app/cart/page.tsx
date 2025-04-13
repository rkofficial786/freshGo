import React from 'react'
import CartPage from './Cart'


export const metadata = {
  title: "Your Cart",
  description: 
    "Review the items in your cart at FreshGo. Complete your purchase of fresh groceries, produce, and pantry essentials. Shop now and enjoy quality fresh foods delivered to your doorstep.",
};


const page = () => {
  return (
    <div><CartPage/></div>
  )
}

export default page