import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import userStore from '../../store/userStore';
import Swal from 'sweetalert2'

function Login(props) {

    const userRole = userStore(state => state.userRole);

    const setUserId = userStore(state => state.setUserId);
    const setUserRole = userStore(state => state.setUserRole);
    const setUserName = userStore(state => state.setUserName);
    const setUserEmail = userStore(state => state.setUserEmail);
    const setUserPhone = userStore(state => state.setUserPhone);
    const setUserAddress = userStore(state => state.setUserAddress);
    const setUserLicenseNum = userStore(state => state.setUserLicenseNum);
    const setUserImage = userStore(state => state.setUserImage);

    const [inputUserId, setInputUserId] = useState("");
    const [inputPassword, setInputPassword] = useState("");

    const onChangeId = (e) => {
        setInputUserId(e.target.value);
    }
    const onChangePassword = (e) => {
        setInputPassword(e.target.value);
    }

    const onSubmit = (e) => {
        // ! axios POST
        axios
            .post("https://k6e203.p.ssafy.io:8443/api/auth/login",
                {
                    user_id: inputUserId,
                    user_password: inputPassword,
                },
            )
            .then((e) => {
                Swal.fire({
                    icon: 'success',
                    title: 'success!',
                    showConfirmButton: false,
                    timer: 1500
                  })
                localStorage.setItem("id", e.data[1]);
                localStorage.setItem("access_token", e.data[0]);
                userData();
            })
            .catch((e) => {
                console.error(e.message);
                Swal.fire({
                    icon: 'error',
                    title: 'error!',
                    showConfirmButton: false,
                    timer: 1500
                  })
            });
    };
    function userData() {
        // ! axios get
        axios
            .get(`https://k6e203.p.ssafy.io:8443/api/member?userId=${localStorage.getItem("id")}`)
            .then((result) => {
                setUserId(result.data.userId);
                setUserRole(result.data.userRole);
                setUserName(result.data.userName);
                setUserEmail(result.data.userEmail);
                setUserPhone(result.data.userPhone);
                setUserAddress(result.data.userAddress);
                setUserLicenseNum(result.data.userLicensenum);
                setUserImage(result.data.userImage);
                localStorage.setItem("userImage", result.data.userImage);
                localStorage.setItem("userName", result.data.userName);
                localStorage.setItem("userRole", result.data.userRole);
                if(result.data.userRole === 2){
                    navigate("/storeMyPage");
                }
                if(result.data.userRole === 3){
                    navigate("/main");
                }
            })
            .catch((e) => {
                console.error(e)
            });
    }
    let navigate = useNavigate();

    return (
        <div className='login'>
            <div className='title'>
                <img className='loseImg' src='img/logoClearance.png' alt='' />
            </div>
            <Container className='mt-5'>
                <Form className='form'>
                    <Form.Group as={Row} className="mb-3">
                        <Col sm>
                            <Form.Control maxLength={20} placeholder="?????????" value={inputUserId} onChange={onChangeId} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Col sm>
                            <Form.Control maxLength={20} type="password" placeholder="????????????" value={inputPassword} onChange={onChangePassword} />
                        </Col>
                    </Form.Group>

                    <div className="d-grid gap-1 mb-3">
                        <Button className='button' onClick={onSubmit}>?????????</Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
}

export default Login;
