import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import Main from './components/main/Main';
import SignupUser from './components/register/SignupUser';
import SignupStore from './components/register/SignupStore';


function App() {
  return (
    <div className='App'>
      <BrowserRouter>
         <Routes>
          <Route path="/" element={ <Main /> } />

          <Route path="/signupUser" element={<SignupUser />} />
          <Route path="/signupStore" element={<SignupStore />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


