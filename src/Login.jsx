import React, { useState } from "react";
import {Link} from 'react-router-dom';
import "./index.css";
import financeImg from "./images/finance.svg";
import SignImg from "./images/signup.svg";
import User from "./images/person-fill.svg";
import Pass from "./images/lock-fill.svg";
import Mail from "./images/envelope-fill.svg";

export default function Login() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign In Form */}
          <form className="sign-in-form">
            <h2 className="title">Sign In</h2>
            <div className="input-field">
                <img src={User}/>
              <input type="text" placeholder="Username" />
            </div>
            <div className="input-field">
                <img src={Pass}/>
              <input type="password" placeholder="Password" />
            </div>
            <button type="submit" className="btn">
                <Link to='./Dashboard'>Sign in</Link>
            </button>
          </form>

       
          <form className="sign-up-form">
            <h2 className="title">Sign Up</h2>
            <div className="input-field">
            <img src={User}/>
              <input type="text" placeholder="Username" />
            </div>
            <div className="input-field">
            <img src={Mail}/>
              <input type="email" placeholder="Email" />
            </div>
            <div className="input-field">
            <img src={Pass}/>
              <input type="password" placeholder="Password" />
            </div>
            <button type="submit" className="btn">Sign Up</button>
          </form>
        </div>
      </div>


      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Join our app and get a great hands-on experience of personal finance management.</p>
            <button className="btn transparent" onClick={toggleMode}>Sign Up</button>
          </div>
          <img src={financeImg} className="image" alt="Finance Illustration" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Already a member?</h3>
            <p>Log in to access your dashboard and manage your finances.</p>
            <button className="btn transparent" onClick={toggleMode}>Sign In</button>
          </div>
          <img src={SignImg} className="image" alt="Sign In Illustration" />
        </div>
      </div>
    </div>
  );
}


