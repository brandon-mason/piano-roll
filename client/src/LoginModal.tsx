import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Reducer } from './Tools/Interfaces'
import './LoginModal.css';
import axios from "axios";

interface RegModalProps {
  onClose: Function;
  onRegister: Function;
  setShowRegister: Function;
}

function RegModal(props: RegModalProps) {
  const formRef = useRef(null);

  return(
    <>
      <div id='reg-bg'></div>
      <div id='loginreg-modal'>
        <button className='loginreg-element close-button' onClick={() => {props.onClose(false); props.onRegister(false)}}>X</button>
        <form 
          id='register-form' 
          ref={formRef}
          method='post'
          onSubmit={async (e: React.SyntheticEvent) => {
            e.preventDefault();
            const target = e.target as typeof e.target & {
              email: { value: string };
              username: {value: string};
              password: { value: string };
            };
            const email = target.email.value; // typechecks!
            const username = target.username.value;
            const password = target.password.value; // typechecks!
            console.log(email, username, password)
            const url = `${process.env.REACT_APP_API}/register`;
            const options = {
              method: 'POST',
              mode: 'cors',
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Origin-Allow': true
              },
              email: email,
              username: username,
              password: password,
            };
            if(email.includes('@') && email.includes('.com') && email.length < 7) {
              alert('Invalid Email')
              return;
            }
            if(username.length < 6) {
              alert('Invalid Username')
              return;
            }
            if(password.length < 6 ) {
              alert('Invalid Password')
              return;
            }

            const credentials = await axios.post(url, options)
            .then((res) => {
              alert(res.data.message);
              props.setShowRegister(false)
            }).catch((err) => console.error(err));
            console.log(credentials)
          }}
        >
          <label className='credentials-label'>Email:</label>
          <input type='email' name='email' id='email' className='loginreg-element'></input>
          <label className='credentials-label'>Username:</label>
          <input type='username' name='username' id='reg-username' className='loginreg-element'></input>
          <label className='credentials-label'> Password:</label>
          <input type='password' name='password' id='reg-password' className='loginreg-element'></input>
          <input type='submit' id='register' className='loginreg-element button' value='Register'></input>
        </form>
      </div>
    </>
  )
}



interface LoginModalProps {
  onClose: Function;
  onRegister: Function;
  setUser: Function;
}

function LoginModal(props: LoginModalProps) {
  const formRef = useRef(null);
  const [user, setUser] = useState('');

  useEffect(() => {
    async function getCookie() {
      const url = `${process.env.REACT_APP_API}/cookie/${user}`;
      const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Origin-Allow': process.env.REACT_APP_APP,
            'Access-Control-Allow-Credentials': true,
        },
        withCredentials: true
      };
      const cookie = await axios.get(url, options)
      .then((res) => {
        console.log(res.data)
      }).catch((err) => console.error(err))
    }

    // console.log(user)
    if(user.length > 0) {
      props.setUser(user);
      // getCookie();
    }
  }, [user]);
 

  return(
    <>
      <div id='popup-bg'></div>
      <div id='loginreg-modal'>
        <button className='loginreg-element close-button' onClick={() => props.onClose(false)}>X</button>
        <form 
          id='login-form'
          ref={formRef}
          method='post'
          onSubmit={async (e: React.SyntheticEvent) => {
            e.preventDefault();
            const target = e.target as typeof e.target & {
              username: {value: string};
              password: { value: string };
            };
            const username = target.username.value;
            const password = target.password.value; // typechecks!
            const url = `${process.env.REACT_APP_API}/login`;
            const options = {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Origin-Allow': process.env.REACT_APP_APP,
                'Access-Control-Allow-Credentials': true,
              },
              withCredentials: true,
              username: username,
              password: password,
            };
            if(username.length < 6) {
              alert('Invalid Username')
              return;
            }
            if(password.length < 6 ) {
              alert('Invalid Password')
              return;
            }

            await axios.post(url, options)
            .then((res) => {
              console.log(res)
              window.localStorage.setItem('token', res.data.data);
              window.localStorage.setItem('loggedIn', 'true');
              // alert(res.data.message);
              setUser(username);
            }).catch((err) => console.error(err));
            
            // console.log(credentials)
          }}
        >
          <label className='credentials-label'>Username/Email:</label>
          <input type='username' name='username' id='login-username' className='loginreg-element'></input>
          <label className='credentials-label'> Password:</label>
          <input type='password' name='password' id='login-passsword' className='loginreg-element'></input>
          <input type='submit' id='login' className='loginreg-element button' value='Login'></input>
          <span style={{fontSize: '12px', textDecoration: 'underline'}} onClick={async () => {
            const url = `${process.env.REACT_APP_API}/forgot-password`;
            const options = {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Content-Type': 'applications/json',
                'Access-Control-Origin-Allow': process.env.REACT_APP_APP,
              }
            }

            await axios.post(url, options)
            .then((res) => {
              console.log(res.data);
            })
          }}>Forgot Password</span>
          <label className='register-label'> Don't have an account?</label>
          <button id='register' className='loginreg-element button' onClick={() => props.onRegister(true)}>Register</button>
        </form>
      </div>
    </>
  )
}

interface ShowLoginModalProps {
  username: string;
  setFocus: Function;
  setUsername: Function;
}

function ShowLoginModal(props: ShowLoginModalProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  // const [username, setUsername] = useState('');
  const loginButton = useMemo<JSX.Element>(() => {
    function logout() {
      window.localStorage.clear();
      const url = `${process.env.REACT_APP_API}/logout`
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Origin-Allow': process.env.REACT_APP_APP
        },
        withCredentials: true,
        username: props.username
      }
      axios.post(url, options)
      .then((res) => {
        console.log(res.data);
      }).catch((err) => console.error(err))

      // setUsername('');
      props.setUsername('')
    }
    return (props.username.length === 0) ? <button className='loginout settings button' onClick={() => setShowLogin(true)} >Login</button> : <button className='loginout settings button' onClick={() => {logout()}}>Logout</button>
  }, [props.username])
  const logreg = useMemo<JSX.Element>(() => {
    if(showLogin && !showRegister) {
      return createPortal(
        <LoginModal onClose={setShowLogin} onRegister={setShowRegister} setUser={loggedIn} />,
        document.body
      )
    } else if(showRegister) {
      return createPortal(
        <RegModal onClose={setShowLogin} onRegister={setShowRegister} setShowRegister={setShowRegister} />,
        document.body
      )
      }

    function loggedIn(username: string) {
      props.setUsername(username)
      // setUsername(username)
      setShowLogin(false)
    }

    return <></>
  }, [showLogin, showRegister])
  // const [elemToShow, setElemToShow] = useState<()

  // useEffect(() => {
  //   setUsername(props.username)
  // }, [props.username]);

  useEffect(() => {
    props.setFocus(showLogin);
  }, [showLogin]);

  // useEffect(() => {
  //   props.setUser(user);
  // }, [user])

  function setFocusLogin(focus: boolean) {
    
  }

  return(
    <>
      {loginButton}
      {logreg}
    </>
  )
}

export default ShowLoginModal;