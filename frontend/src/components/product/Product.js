import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button,Tabs,Tab,Modal } from "react-bootstrap";
import productStore from "../../store/productStore";
import "./Product.css";
import { Link, useNavigate } from "react-router-dom";
import NavBar from '../common/NavBar';

// 상품을 클릭했을 때 나올 화면
const Product = () => {

    //새로고침 할 때마다 수량이 갱신되어야 함! => 매 새로고침마다 axios를 통해서 db에 있는 데이터를 사용해야 함!
    const product_id = localStorage.getItem("product_id")
    console.log("이곳에서 사용할 product_id : ", product_id)

    const [info, setInfo] = useState({
        category_id:"",
        productDiscount: 0.1,
        productDiscountPrice: 0,
        productExpdate: '',
        productId: "",
        productImagefront: '',
        productImageback:'',
        productName: "",
        productPrice: 0,
        productStock: 0,
        storeUserId: '',

    });

    const getInfo = async () => {
        try {
        const response = await axios.get(`http://localhost:8080/api/product?productId=${product_id}`)
            console.log(response)
            setInfo((prev) => ({
                ...prev,
                categoryId: response.data.categoryId,
                productDiscount: response.data.productDiscount,
                productDiscountprice: response.data.productDiscountprice,
                productExpdate: response.data.productExpdate,
                productId: response.data.productId,
                productImagefront: response.data.productImagefront,
                productImageback: response.data.productImageback,
                productName: response.data.productName,
                productPrice: response.data.productPrice,
                productStock: response.data.productStock,
                storeUserId: response.data.storeUserId,

            }))
        } catch (error) {
            console.log(error)
        }
        
    }
    
    // 2. localstorage 사용 => 새로 고침 시, 데이터가 갱신되어야 함 -> axios로 변경
    // const category_id = localStorage.getItem("category_id")
    // const store_user_id = localStorage.getItem("store_user_id")
    // const product_price = localStorage.getItem("product_price")
    // const product_name = localStorage.getItem("product_name")
    // const product_discount = localStorage.getItem("product_discount")
    // const product_discountedPrice = localStorage.getItem("product_discount_price")
    // const product_stock = localStorage.getItem("product_stock")
    // const product_expdate = localStorage.getItem("product_expdate")
    // const product_image_front = localStorage.getItem("product_image_front")
    // const product_image_back = localStorage.getItem("product_image_back")
    
    const basket_cnt = productStore(state => state.basket_cnt)
    const setBasketCnt = productStore(state => state.setBasketCnt)
    const [modalShow, setModalShow] = useState(false)

    useEffect(() => {
        setBasketCnt(1);
    },[])
    let navigate = useNavigate();
        //
        // console.log(category_id)
        // console.log("storeId는 " ,store_user_id)
        // console.log("product_price는 " ,product_price)
        // console.log("product_name은 " ,product_name)
        // console.log("product_discount는", product_discount)
        // console.log("product_discountedPrice는 ", product_discountedPrice)
        // console.log("product_stock은 ", product_stock)
        // console.log("product_expdate는", product_expdate)
        // console.log("product_imgfront는" , product_image_front)
        // console.log("product_imgback은", product_image_back)
    
    
    function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          알림
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>장바구니에 상품이 등록되었습니다.</h4>
        <p>
          장바구니로 이동하시겠습니까?
        </p>
      </Modal.Body>
      <Modal.Footer>
              <Button onClick={() => {
                navigate("/basket")
        }}>장바구니로 이동</Button>
              <Button onClick={() => {
                navigate("/main")
        }}>계속 쇼핑하기</Button>
    </Modal.Footer>
    </Modal>
    );
}
    
    const basketadd = async () => {
        try {
            const response = await axios.post(`https://k6e203.p.ssafy.io:5001/data/basket-add`, {
            "user_id": sessionStorage.getItem("id"),
            "product_id": product_id,
            "basket_count": basket_cnt // 예약할 상품 개수
            })
            console.log(response)
            setModalShow(true)
            // alert("장바구니에 내용이 추가되었습니다.")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getInfo()
    },[])
    // 새로고침하면 내용이 사라지는 이슈 발생
    // localstorage로 데이터 보관을 변경하여 해결

    //구매 진행 중 누가 사버려서 구매가 불가능 -> 예약 진행 시 재고량 감소 처리해야 할듯?
    // -> zustans(x) -> localstorage(x) -> axios(o)
    console.log(info)
    return (
        <div>
            <NavBar></NavBar>
            <div id="product" className="pb-2 pt-2">
                <img alt="" src={info.productImagefront}></img>

                <div>상품명 : {info.productName},</div>
                <div>원가 : <span style={{
                    textDecoration: "line-through" 
                }}>{info.productPrice},</span>
                </div>
                <div>할인률 : {info.productDiscount * 100}%,</div>
                <div>할인가격 : {info.productDiscountprice}</div>
                <div>잔여 재고 : {info.productStock}</div>
                <div>
                    <Button onClick={() => {
                        if (basket_cnt > 1)
                            setBasketCnt(basket_cnt-1)
                    }}> ◀ </Button>
                    <span style={{
                        paddingLeft: "3%",
                        paddingRight: "3%"
                    }}>개수 : {basket_cnt} </span>
                    <Button onClick={() => {
                        if(basket_cnt < info.productStock)
                        setBasketCnt(basket_cnt+1)
                    }}> ▶ </Button>
                    
                    
                </div>

                <div style={{
                    paddingTop: "10px"
                }}>
                    <Button onClick={() => {
                        basketadd();
                        
                    }}>장바구니 등록</Button>
                    <Link to="/main"><Button>돌아가기</Button></Link>
                </div>
                
            
            </div>
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="상품설명" title="상품설명">
                    <img alt="" src={info.productImageback}></img>
                    </Tab>
                    <Tab eventKey="이용안내" title="이용안내">
                        이용안내
                    </Tab>
                    <Tab eventKey="유의사항" title="유의사항">
                        유의사항
                    </Tab>
            </Tabs>
            
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </div>
    )
}

export default Product;