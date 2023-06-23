import React,{useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router';
import copy from 'copy-to-clipboard';
import UPIimg from '../images/upi.png';
import iciciImg from '../images/icici.jpg';
import successImg from '../images/success.svg';
import errorImg from '../images/error.svg';

const Payment = () => {
  
  const [reNum,setRefNum] = useState('');
  const [upi,setUpi] = useState('');
  const [amount,setAnount] = useState('');

  const toast = useRef();
  const TimeOutModel = useRef();
  const successModel = useRef();
  const toatInner = useRef();
  const { payId } = useParams();

  const closeTab = ()=>{
    window.close();
  }

  const copyAmount = ()=>{
      copy(amount);
      toast.current.classList.add('show-text');
      toatInner.current.innerHTML = 'copy success';
      setTimeout(()=>{
        toast.current.classList.remove('show-text');
        },2000);
        }


  const showToast = (text)=>{
    toast.current.classList.add('show-text');
      toatInner.current.innerHTML = text;
      setTimeout(()=>{
        toast.current.classList.remove('show-text');
        },2000);
  }

  const copyUPI = ()=>{
      copy(upi);
      toast.current.classList.add('show-text');
      setTimeout(()=>{
        toast.current.classList.remove('show-text');
      },2000);
  }

 

  const submit = ()=>{
    if(reNum.length !==12){
      showToast('Please enter valid UTR number');
      return;
    }
    
     fetch('/api/submitpay',{
       method:'post',
       body:JSON.stringify({UTR:reNum,payId:payId}),
       headers:{
         'Content-Type':'application/json'
       }
     }).then((data)=>data.json()).then((finalData)=>{
       if(finalData.message === 'success'){
        successModel.current.classList.remove('hide-text');
        successModel.current.classList.add('show-model');
       }else{
        showToast('Some server error');
       }
     });
   }


   useEffect(() => {
    fetch('/api/getdetails',{
      method:'post',
      body:JSON.stringify({payId:payId}),
      headers:{
        'Content-Type':'application/json'
      }
    }).then((data)=>data.json()).then((finalData)=>{
     if(finalData.message === 'invalid'){
       TimeOutModel.current.classList.add('show-model');
       return;
     }
    
     if((((new Date().getTime())-finalData.data.time)/1000)>600){
       TimeOutModel.current.classList.add('show-model');
       return;
     }else{
       let x = new Date(finalData.data.time + (1000*60*10)).getTime();
       let timerInterval = setInterval(()=>{
         let minCount = Math.floor((x- (new Date().getTime()))/60000);
         let secCount = Math.floor(((x- (new Date().getTime()))%60000)/1000);
         let minuteDiv = document.getElementById('min-div');
         let secDiv = document.getElementById('sec-div');

         if(minCount<0 && secCount <0){
           clearInterval(timerInterval);
          TimeOutModel.current.classList.add('show-model');
         }else{
          if(minuteDiv){
            minuteDiv.innerHTML = `0${minCount}`;
            secDiv.innerHTML = secCount;
          }
         }
       },1000);
     }
     setAnount(finalData.data.rechargeAmount);
     setUpi(finalData.data.toUpi);
    });
   }, []);

  return (
    <>
     <div id="steputr">
        <div className="logo-box"><img src={UPIimg} alt="logo" className="logo" />
        </div><span className="cutdown"><span id="min-div"></span> : <span id="sec-div"></span></span>
        <div className="account-container">
          <div className="center-section">
            <div className="center-section-item">
              <h4 className="header">Step 1.Copy UPI Information</h4>
            </div>
            <div className="center-section-item">
              <div className="cell"><strong >Amount:</strong><span
                id="amount" className="em">{amount}</span><button style={{cursor:'pointer'}}
                  className="copybtn" onClick={copyAmount}> copy </button></div>
            </div>
            <div className="center-section-item bottom-border">
              <div className="cell"><strong >VPA/UPI:</strong><span
                id="payinAccount">{upi}</span><button style={{cursor:'pointer'}} className="copybtn" onClick={copyUPI}> copy </button></div>
            </div>
          </div>
          <div className="center-section">
            <div className="center-section-item">
              <h4 className="header"> Step 2.Transfer and don't modify this amount to us by UPI
                transfer. </h4>
            </div>
            <div className="center-section-item">
              <div className="cell bottom-border"><img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPBAMAAADJ+Ih5AAAAIVBMVEXtjIztjIxHcEztjIztjIztjIztjIztjIztjIztjIztjIxGEBYNAAAACnRSTlPz5gDQHVjBMa2DWV9XYwAAAG1JREFUCNcljTEKgFAMQzMIwp/+JOL0qZ7CUcFZHEScPIPH8BYiCOaUptopTdJXmC2xnCzBBpJ3l9BUPMksoSbzllfCqrUlRxyfww3VLyLCL+BO9jnq3ME7uvIZnfOIKXLwSGTrFVy7hM2x0PcXVRsvNTDqbCsAAAAASUVORK5CYII=" alt="m-img" /><span
                  id="payinAccount" className="tips">Please record your reference No.(Ref No.)
                  after payment</span></div>
            </div>
          </div>
          <div className="center-section input-section">
            <div className="center-section-item">
              <h4 className="header"> Step 3.Please enter Ref No. to complete the recharge </h4>
            </div>
            <div className="center-section-item">
              <div className="cell"><img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPBAMAAADJ+Ih5AAAAIVBMVEXtjIztjIxHcEztjIztjIztjIztjIztjIztjIztjIztjIxGEBYNAAAACnRSTlPz5gDQHVjBMa2DWV9XYwAAAG1JREFUCNcljTEKgFAMQzMIwp/+JOL0qZ7CUcFZHEScPIPH8BYiCOaUptopTdJXmC2xnCzBBpJ3l9BUPMksoSbzllfCqrUlRxyfww3VLyLCL+BO9jnq3ME7uvIZnfOIKXLwSGTrFVy7hM2x0PcXVRsvNTDqbCsAAAAASUVORK5CYII=" alt="pngi" /><span
                  id="payinAccount" className="tips">Be sure to <em
                  >return</em> this page to fill in the <em >UTR
                    numbers after</em> you have completed your payment</span></div>
              <div className="cell bottom-border"><input maxLength="12"
                placeholder="UTR (UPI Ref.ID) must be 12 digits" name="ref" value={reNum} onChange={(e)=>setRefNum(e.target.value)} className="utr-input" />
                <div className="hr"></div>
              </div>
            </div>
          </div>
          <div className="btn-area"><button className="button" onClick={submit}>Submit UTR</button></div>
        </div>
        <div className="copys">©2022 Fastpay Technical Support All Rights Reserved</div>
        <div className="copys" style={{paddingLeft: '0.25rem',marginTop: '0px'}}>In case of any issuers or
          queries please contact <strong id="mail">runmall888@gmail.com</strong> or try again
        </div>
        <div className="upi-area">
          <div className="supports">
            <ul style={{listStyle:'none'}}>
              <li ><img src={UPIimg} alt="upi" /></li>
              <li ><img src={iciciImg} alt="icici" /></li>
            </ul>
          </div>
        </div>
        <div className="van-overlay" style={{zIndex: '2001',display: 'none'}}></div>
        <div className="van-overlay" style={{zIndex: '2018',display: 'none'}}></div>
      </div>

      <div ref={successModel} className="alert-wrapper hide-text">
      <div className="alert-frame">
        <div className="alert-header success-bg">
          <span onClick={closeTab} className="alert-close alert-close-default">X</span>
          <img className="alert-img" src={successImg} alt="success" />
        </div>
        <div className="alert-body">
          <span className="alert-title">Success</span>
          <span className="alert-message">Submitted successfully</span> 
    <button onClick={closeTab} className="alert-button success-bg success-btn">Okay</button>
        </div>
      </div>
    </div>

    <div ref={TimeOutModel} className="alert-wrapper hide-text">
      <div className="alert-frame">
        <div className="alert-header error-bg">
          <span onClick={closeTab} className="alert-close alert-close-default">X</span>
          <img className="alert-img" src={errorImg} alt="errorimg" />
        </div>
        <div className="alert-body">
          <span className="alert-title">NOTICE</span>
          <span className="alert-message">The order has timed out, or does not exist</span>
    <button onClick={closeTab} className="alert-button error-bg error-btn">Okay</button>
        </div>
      </div>
    </div>

    <div ref={toast} className="van-toast van-toast--middle van-toast--text hide-text" style={{zIndex:'2004'}}>
       <div ref={toatInner} className="van-toast__text">Copy success</div>
     </div>
    </>
  )
}

export default Payment
