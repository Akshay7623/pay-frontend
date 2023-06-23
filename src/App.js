import {Routes, Route} from 'react-router-dom';
import Welcome from './Components/Welcome';
import Payment from './Components/Payment';
import './App.css';

function App() {
  return (
    <>
    <Routes>
    <Route path='/:payId' element={<Welcome/>}></Route>
    <Route path='/makepayment/:payId' element={<Payment/>}></Route>
   </Routes>
    </>
  );
}

export default App;
