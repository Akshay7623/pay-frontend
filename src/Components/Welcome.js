import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router';
import Success from '../images/success.svg';

const Welcome = () => {

  const { payId } = useParams();
  
  if(payId.length !== 24){
    window.close();
   }

  return (
    <>
       <div className="alert-wrapper">
        <div className="alert-frame custom">
          <div className="alert-header success-bg">
            <span className="alert-close alert-close-circle">X</span>
            <img className="alert-img" src={Success} alt="payimg" />
          </div>
          <div className="alert-body">
            <span className="alert-title">Dear Sir/Madam,</span>
            <span className="alert-message">kindly click the button to continue.</span>

            <NavLink to={`/makepayment/${payId}`}> <button className="alert-button success-bg success-btn">Continue</button></NavLink>

          </div>
        </div>
      </div>
    </>
  )
}

export default Welcome
