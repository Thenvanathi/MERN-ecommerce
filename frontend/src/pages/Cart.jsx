import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import {loadStripe} from '@stripe/stripe-js';

const Cart = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)


    const fetchData = async() =>{
        
        const response = await fetch(SummaryApi.addToCartProductView.url,{
            method : SummaryApi.addToCartProductView.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
        })
       

        const responseData = await response.json()

        if(responseData.success){
            setData(responseData.data)
        }


    }

    const handleLoading = async() =>{
        await fetchData()
    }

    useEffect(()=>{
        setLoading(true)
        handleLoading()
         setLoading(false)
    },[])


    const increaseQty = async(id,qty) =>{
        const response = await fetch(SummaryApi.updateCartProduct.url,{
            method : SummaryApi.updateCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                    quantity : qty + 1
                }
            )
        })

        const responseData = await response.json()


        if(responseData.success){
            fetchData()
        }
    }


    const decraseQty = async(id,qty) =>{
       if(qty >= 2){
            const response = await fetch(SummaryApi.updateCartProduct.url,{
                method : SummaryApi.updateCartProduct.method,
                credentials : 'include',
                headers : {
                    "content-type" : 'application/json'
                },
                body : JSON.stringify(
                    {   
                        _id : id,
                        quantity : qty - 1
                    }
                )
            })

            const responseData = await response.json()


            if(responseData.success){
                fetchData()
            }
        }
    }

    const deleteCartProduct = async(id)=>{
        const response = await fetch(SummaryApi.deleteCartProduct.url,{
            method : SummaryApi.deleteCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                }
            )
        })

        const responseData = await response.json()

        if(responseData.success){
            fetchData()
            context.fetchUserAddToCart()
        }
    }

  const handlePayment = async()=>{

        const stripePromise = await loadStripe('pk_test_51RILZnFzfatXTCJLG1nFHidlS3klyC1qmyvp4UyQE0UHu2mnhFhp4EgrvLnNghkqyqiAFvoPWC3W83LEYafWHfFp00kfuckey3')
        const response = await fetch(SummaryApi.payment.url,{
            method : SummaryApi.payment.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify({
                cartItems : data
            })
        })               
 
        const responseData = await response.json()

        if(responseData?.id){
            stripePromise.redirectToCheckout({ sessionId : responseData.id})
        }

        console.log("payment response",responseData)
    } 

    const totalQty = data.reduce((previousValue,currentValue)=> previousValue + currentValue.quantity,0)
    const totalPrice = data.reduce((preve,curr)=> preve + (curr.quantity * curr?.productId?.sellingPrice) ,0)
   
    return (
        <div className='container mx-auto px-4'>
            {/* No Data Text */}
            <div className='text-center text-lg my-3'>
                {data.length === 0 && !loading && (
                    <p className='bg-white py-5'>No Data</p>
                )}
            </div>

            {/* Main Flex Layout */}
            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between'>
                {/* Product List */}
                <div className='w-full max-w-3xl'>
                    {loading ? (
                        loadingCart?.map((el, index) => (
                            <div key={el + "Add To Cart Loading" + index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'></div>
                        ))
                    ) : (
                        data.map((product, index) => (
                            <div key={product?._id + "Add To Cart"} className='w-full bg-white my-2 border border-slate-300 rounded flex gap-4 p-4 items-center'>
                                {/* Image */}
                                <div className='min-w-[100px] max-w-[100px] h-[100px] bg-slate-100 flex items-center justify-center rounded'>
                                    <img src={product?.productId?.productImage[0]} className='max-w-full max-h-full object-contain mix-blend-multiply' />
                                </div>

                                {/* Info */}
                                <div className='flex-1 relative'>
                                    {/* Delete */}
                                    <div
                                        className='absolute top-0 right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer'
                                        onClick={() => deleteCartProduct(product?._id)}
                                    >
                                        <MdDelete />
                                    </div>

                                    <h2 className='text-lg font-semibold line-clamp-1'>{product?.productId?.productName}</h2>
                                    <p className='capitalize text-slate-500'>{product?.productId?.category}</p>

                                    <div className='flex justify-between items-center mt-2'>
                                        <p className='text-red-600 font-semibold text-md'>
                                            {displayINRCurrency(product?.productId?.sellingPrice)}
                                        </p>
                                        <p className='text-slate-600 font-semibold text-md'>
                                            {displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-3 mt-2'>
                                        <button
                                            className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-7 h-7 flex justify-center items-center rounded'
                                            onClick={() => decraseQty(product?._id, product?.quantity)}
                                        >-</button>
                                        <span className='font-medium'>{product?.quantity}</span>
                                        <button
                                            className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-7 h-7 flex justify-center items-center rounded'
                                            onClick={() => increaseQty(product?._id, product?.quantity)}
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/***summary  */}
                {
                    data[0] && (
                        <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                        {
                            loading ? (
                            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'>
                                
                            </div>
                            ) : (
                                <div className='h-36 bg-white'>
                                    <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
                                    <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                        <p>Quantity</p>
                                        <p>{totalQty}</p>
                                    </div>

                                    <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                        <p>Total Price</p>
                                        <p>{displayINRCurrency(totalPrice)}</p>    
                                    </div>

                                    <button className='bg-blue-600 p-2 text-white w-full mt-2' onClick={handlePayment}>Payment</button>

                                </div>
                            )
                        }
                        </div>
                    )
                }
                
        </div>
    </div>
    );
};

export default Cart;