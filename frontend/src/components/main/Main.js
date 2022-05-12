import React from 'react';
import NavBar from '../common/NavBar';
import Map from "./Map";
import { useState } from 'react';
import useMainStore from '../../store/MainStore';
import './ProductItem.css'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import productStore from '../../store/productStore';


function Main(props) {

  const pos = useMainStore(state => state.position)
  

  

  const nearProduct = useMainStore(state => state.nearProduct)
  const getNearProduct = useMainStore(state => state.setNearProduct)


  //product_id 값을 포함한, 상세 페이지에 필요한 모든 정보를 변경한 후 상세 페이지로 이동
  const setProductId = productStore(state => state.setProductId)

  const setCategoryId = productStore(state => state.setCategoryId)

  const setStoreUserId = productStore(state => state.setStoreUserId)

  const setProductPrice = productStore(state => state.setProductPrice)

  const setProductName = productStore(state => state.setProductName)

  const setProductDiscount = productStore(state => state.setProductDiscount)

  const setProductDiscountedPrice = productStore(state => state.setProductDiscountedPrice)

  const setProductStock = productStore(state => state.setProductStock)

  const setProductExpDate = productStore(state => state.setProductExpDate)

  const setProductImgFront = productStore(state => state.setProductImgFront)
  
  const setProductImgBack = productStore(state => state.setProductImgBack)

    return (
        <div>
            <NavBar></NavBar>
            <h1>메인페이지</h1>
            
            <div style={{ backgroundImage: "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)", margin: "10px 5% 10px 5%" }}>
              <Map></Map>
            </div>
            <div>
          
        </div>
        <div>{pos.lat}, {pos.lng}</div>
        {nearProduct.map((value) => (
          <div id="ProductItem" onClick={() => {console.log("이거", value)}}>
            <img alt="" src = {value.productImagefront}></img>
            {value.productName}, 
            {value.storeUserId}
            <Link to="/product"><Button className='secondary' onClick={() => {
              // setProductId(value.productId)
              // setCategoryId(value.categoryId)
              // setProductDiscount(value.productDiscount)
              // setProductDiscountedPrice(value.productDiscountprice)
              // setProductExpDate(value.productExpdate)
              // setProductImgBack(value.productImageback)
              // setProductImgFront(value.productImagefront)
              // setProductName(value.productName)
              // setProductPrice(value.productPrice)
              // setProductStock(value.productStock)
              // setStoreUserId(value.storeUserId)
              localStorage.setItem("product_id", value.productId)
              localStorage.setItem("category_id", value.categoryId)
              localStorage.setItem("product_discount",value.productDiscount)
              localStorage.setItem("product_discount_price", value.productDiscountprice)
              localStorage.setItem("product_expdate", value.productExpdate)
              localStorage.setItem("product_image_back", value.productImageback)
              localStorage.setItem("product_image_front", value.productImagefront)
              localStorage.setItem("product_name", value.productName)
              localStorage.setItem("product_price", value.productPrice)
              localStorage.setItem("product_stock", value.productStock)
              localStorage.setItem("store_user_id", value.storeUserId)
            }}>상세 보기</Button></Link>
          </div>
        ))}
        </div>
    );
}

export default Main;