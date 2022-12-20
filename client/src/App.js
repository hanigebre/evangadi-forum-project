
// import { useEffect, useContext } from 'react';
// import './App.css';
// import { UserContext } from './Context/UserContext';
// import axios from 'axios';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import SignUp from './Pages/SignUp/SignUp'
// import Home from './Pages/Home/Home'
// import Login from './Pages/Login/Login'

// function App() {
//   const [userData, setUserData] = useContext(UserContext);

//   const checkLoggedIn = async () => {
//     //check if token already exists in localstorage
//     let token = localStorage.getItem('auth-token');
//     if (token === null) {
//       //token not in localStorage then set auth token empty
//       localStorage.setItem('auth-token', '');
//       token = '';
//     } else {
//       //if token exists in localStorage then use auth to verify token and get user info
//       const userRes = await axios.get("http://localhost:4000/api/users", {
//         headers: { 'x-auth-token': token }
//       });
//       //set the global state with user info
//       setUserData({
//         token,
//         user: {
//           id: userRes.data.data.user_id,
//           display_name: userRes.data.data.user_name
//         }
//       })
//     }
//   }
//   const logout = () => {
//     setUserData({
//       token: undefined,
//       user: undefined,
//     });
//     //resetting localStorage
//     localStorage.setItem('auth-token', '');
//   };
//   useEffect(() => {
//     checkLoggedIn();
//   }, [])
//   return (

//     <Router>
//       {/* <h1>hii</h1> */}
//       <div className="App">
//         <Routes>
//           <Route path='/signup' element={<SignUp />} />
//           <Route path='/login' element={<Login />} />
//           {/* passing logout function as props to Home page */}
//           <Route path='/' element={<Home logout={logout} />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;




import axios from 'axios';
import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { UserContext } from './Context/UserContext';
import Header from './Component/Header/Header';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import Footer from './Component/Footer/Footer';
import AskQuestion from './Component/AskQuestion/AskQuestion';
import QuestionDetail from './Component/QuestionDetail/QuestionDetail';
// import AnswerQuestion from ''

function App() {
  const [userData, setUserData] = useContext(UserContext);

  const checkLoggedIn = async () => {
    let token = localStorage.getItem('auth-token');
    if (token === null) {
      localStorage.setItem('auth-token', '');
      token = '';
    } else {
      const userRes = await axios.get('http://localhost:4000/api/users', {
        headers: { 'x-auth-token': token }
      });
      // console.log(userRes);
      setUserData({
        token,
        user: {
          id: userRes.data.data.user_id,
          display_name: userRes.data.data.user_name
        }
      })
    }
  }
  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem('auth-token', '');
  };
  useEffect(() => {
    checkLoggedIn();
  }, []);
  return (
    <Router>
      <Header logout={logout} />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home logout={logout} />} />
        <Route path="/ask-question" element={<AskQuestion />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
      </Routes>
      <Footer />
    </Router>
  )
}
export default App;

