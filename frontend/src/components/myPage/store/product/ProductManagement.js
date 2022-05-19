import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from "date-fns/esm/locale";
import { Button, Container, Table, ModalFooter, FormControl, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal'
import NavBar from '../../../common/NavBar';
import NavStore from '../../../../store/NavStore';
import Fade from "react-reveal/Fade";

function ProductManagement(props) {
    const setNavHeader = NavStore(state => state.setNavHeader);


    const [highlight, setHighlight] = useState();
    const [selectDate, setSelectDate] = useState(new Date());
    const [searchDay, setSearchDay] = useState(splitDate(selectDate));

    const [product, setProduct] = useState();
    const [modalProduct, setModalProduct] = useState();
    const [deleteCheck, setDelectCheck] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);


    console.log(selectDate);


    useEffect(() => {
        setNavHeader("상품 관리");
        // ! axios get
        console.log("axios get")
        axios
            .get(`https://k6e203.p.ssafy.io:8443/api/product/distinctdate?storeuserId=${localStorage.getItem("id")}`)
            // .get(`http://localhost:8080/api/product/distinctdate?storeuserId=in1`)
            .then((result) => {
                setHighlight(result.data);
            })
            .catch((e) => {
                console.error("axios get 실패");
                console.error(e)
            });
    }, [deleteCheck])
    useEffect(() => {
        // ! axios get
        console.log("axios get")
        console.log("searchDay = " + searchDay);
        axios
            .get(`https://k6e203.p.ssafy.io:8443/api/product/date?userId=${localStorage.getItem("id")}&date=${searchDay}`)
            // .get(`http://localhost:8080/api/product/date?userId=in1&date=${searchDay}`)
            .then((result) => {
                console.log(result.data);

                setProduct(result.data);
            })
            .catch((e) => {
                console.error("axios get 실패");
                console.error(e)
            });
    }, [selectDate, deleteCheck])

    function deleteProduct() {
        console.log(modalProduct.productId);
        // ! axios delete
        console.log("axios delete")
        axios
            .delete("https://k6e203.p.ssafy.io:8443/api/product/remove",
                {
                    data: {
                        productId: modalProduct.productId
                    }
                }
            )
            .then(() => {
                alert("상품 삭제 완료");
                setModalShow(false);
                setDelectCheck(!deleteCheck);
            })
            .catch((e) => {
                // console.error("axios get 실패");
                console.error(e)
            });
    }

    function modalControl(data) {
        setModalShow(true);
        setModalProduct(data);
    }

    function MyVerticallyCenteredModal(props) {
        console.log("모달 : " + JSON.stringify(modalProduct));
        return (
            <>
                {modalProduct !== undefined ?
                    <Modal
                        {...props}
                        // size="lg"
                        // aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header closeButton className='pmModalHeader'>
                            <Modal.Title className='pmModalTitle'>상품 상세 정보</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='pmModalBody'>
                            <Table>
                                <tbody>
                                    <tr style={{borderBottom:"hidden"}}>
                                        <td colSpan={2}><img className='img' src={modalProduct.productImagefront} alt=''></img></td>
                                    </tr>
                                    <tr>
                                        <td className='nameTd'>상품 명</td>
                                        <td>{modalProduct.productName}</td>
                                    </tr>
                                    <tr>
                                        <td className='nameTd'>원가</td>
                                        <td>{modalProduct.productPrice}</td>
                                    </tr>
                                    <tr>
                                        <td className='nameTd'>할인 율</td>
                                        <td>{modalProduct.productDiscount * 100}%</td>
                                    </tr>
                                    <tr>
                                        <td className='nameTd'>할인가</td>
                                        <td>{modalProduct.productDiscountprice}원</td>
                                    </tr>
                                    <tr>
                                        <td className='nameTd'>재고</td>
                                        <td>{modalProduct.productStock}</td>
                                    </tr>
                                    <tr>
                                        <td className='nameTd'>유통기한</td>
                                        <td>{modalProduct.productExpdate}</td>
                                    </tr>
                                    <tr>
                                        <td className='nameTd'>카테고리</td>
                                        <td>{changeCategory(modalProduct.categoryId)}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <div className='pmModalBtnGroup'>
                                <Link to="../updateProduct" state={{ data: modalProduct }}><Button className='pmModalUpdateBtn'> 수정 </Button></Link>
                                <Button className='pmModalDeleteBtn' onClick={deleteProduct}> 삭제 </Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                    : null}
            </>

        );
    }

    const highlightArray = [];
    if (highlight !== undefined) {
        highlight.map((data) => {
            highlightArray.push(new Date(data));
        })
    }
    function setDate(date) {
        console.log(date);
        setSelectDate(date)
        setSearchDay(splitDate(date));
    }
    return (
        <div className='productManagement'>
            <NavBar></NavBar>
            <Container>
                <Fade>
                    <DatePicker
                        locale={ko}
                        selected={selectDate}
                        onChange={(date) => setDate(date)}
                        highlightDates={highlightArray}
                        inline />
                </Fade>
                <Link to={"/allProductManagement"}><Button className='pmAllBtn' variant='warning'>전체 상품 관리</Button></Link>
                <div>
                    {product !== undefined && product.length > 0 ?
                        <Table>
                            <colgroup>
                                <col width="25%" />
                                <col width="40%" />
                                <col width="15%" />
                                <col width="20%" />
                            </colgroup>
                            <thead className='pmThead'>
                                <tr>
                                    <th className='pmTh'>상품</th>
                                    <th className='pmTh'>상품명</th>
                                    <th className='pmTh'>재고</th>
                                    <th className='pmTh'>가격</th>
                                </tr>
                            </thead>
                            {product !== undefined ?
                                product.map((data, index) => {
                                    return (
                                        <tbody key={index} className='pmTbody'>
                                            <Fade>
                                                <tr onClick={() => modalControl(data)}>
                                                    <td className='pmTd pmImageDiv'>
                                                        <img className='pmImgFile' src={data.productImagefront} alt="userImage" />
                                                    </td>
                                                    <td className='pmTd' >{data.productName}</td>
                                                    <td className='pmTd' >{data.productStock}</td>
                                                    <td className='pmTd' >{data.productDiscountprice}원</td>
                                                </tr>
                                            </Fade>
                                        </tbody>
                                    )
                                })
                                : null}
                            <MyVerticallyCenteredModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            />

                        </Table>
                        :
                        null}
                </div>

            </Container>
        </div>
    );
}
function splitDate(date) {

    let year = '';
    let month = '';
    let day = '';


    let str = date + '';
    // console.log(str);
    let split = str.split(' ');

    switch (split[1]) {
        case "Jan":
            month = '01';
            break;
        case "Feb":
            month = '02';
            break;
        case "Mar":
            month = '03';
            break;
        case "Apr":
            month = '04';
            break;
        case "May":
            month = '05';
            break;
        case "Jun":
            month = '06';
            break;
        case "Jul":
            month = '07';
            break;
        case "Aug":
            month = '08';
            break;
        case "Sep":
            month = '09';
            break;
        case "Oct":
            month = '10';
            break;
        case "Nov":
            month = '11';
            break;
        case "Dec":
            month = '12';
            break;
        default:
            break;
    }

    year = split[3];
    day = split[2];

    let reDate = year + "-" + month + "-" + day
    return reDate;
}
function changeCategory(data) {
    let reCategory = ""
    switch (data) {
        case 0:
            reCategory = "과일";
            break;
        case 1:
            reCategory = "채소";
            break;
        case 2:
            reCategory = "쌀/잡곡/견과";
            break;
        case 3:
            reCategory = "정육/계란류";
            break;
        case 4:
            reCategory = "수산물/건해산";
            break;
        case 5:
            reCategory = "우유/유제품/유아식";
            break;
        case 6:
            reCategory = "냉장/냉동/간편식";
            break;
        case 7:
            reCategory = "밀키트/김치/반찬";
            break;
        case 8:
            reCategory = "생수/음료/주류";
            break;
        case 9:
            reCategory = "커피/원두/차";
            break;
        case 10:
            reCategory = "라면/면류/즉석식품/통조림";
            break;
        case 11:
            reCategory = "장류/양념/가루/오일";
            break;
        case 12:
            reCategory = "과자/시리얼/빙과/떡";
            break;
        case 13:
            reCategory = "베이커리/잼/샐러드";
            break;
        case 14:
            reCategory = "건강식품";
            break;
        default:
            break;
    }
    return reCategory;
}
export default ProductManagement;