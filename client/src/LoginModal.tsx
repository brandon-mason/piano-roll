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
    console.log(user)
    if(user.length > 0) props.setUser(user);
  }, [user]);
 

  return(
    <>
      <div id='login-bg'></div>
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
                  'Access-Control-Origin-Allow': true
              },
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

            const credentials = await axios.post(url, options)
            .then((res) => {
              console.log(res.data)
              alert(res.data.message);
              setUser(username);
            }).catch((err) => console.error(err));
            console.log(credentials)
          }}
        >
          <label className='credentials-label'>Username/Email:</label>
          <input type='username' name='username' id='login-username' className='loginreg-element'></input>
          <label className='credentials-label'> Password:</label>
          <input type='password' name='password' id='login-passsword' className='loginreg-element'></input>
          <input type='submit' id='login' className='loginreg-element button' value='Login'></input>
          <label className='register-label'> Don't have an account?</label>
          <button id='register' className='loginreg-element button' onClick={() => props.onRegister(true)}>Register</button>
        </form>
      </div>
    </>
  )
}

interface ShowLoginModalProps {
  setFocus: Function;
  setUser: Function;
}

function ShowLoginModal(props: ShowLoginModalProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState('');
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

    function loggedIn(user: string) {
      props.setUser(user)
      setUser(user)
      setShowLogin(false)
    }

    return <></>
  }, [showLogin, showRegister])
  // const [elemToShow, setElemToShow] = useState<()

  useEffect(() => {
    // setElemToShow(
    //   <>
    //     <button onClick={() => setShowLogin(true)} >Login</button>
    //     {showLogin && createPortal(
    //       (showRegister) ? <LoginModal onClose={setShowLogin} onRegister={setShowRegister} /> : <RegModal onClose={setShowLogin} onRegister={setShowRegister} />,
    //       document.body
    //     )}
    //   </>
    // )
  }, [showRegister]);

  useEffect(() => {
    console.log(showLogin);
    props.setFocus(showLogin);
  }, [showLogin]);

  // useEffect(() => {

  // }, [showLogin, showRegister])

  function setFocusLogin(focus: boolean) {
    
  }

  return(
    <>
      {(user.length === 0) ? <button onClick={() => setShowLogin(true)} >Login</button> : <button onClick={() => {setUser(''); props.setUser('');}}>Logout</button>}
      {/* {showLogin && !showRegister && createPortal(
        <LoginModal onClose={setShowLogin} onRegister={setShowRegister} />,
        document.body
      )}
      {showRegister && createPortal(
        <RegModal onClose={setShowLogin} onRegister={setShowRegister} />,
        document.body
      )} */}
      {logreg}
    </>
  )
}

export default ShowLoginModal;