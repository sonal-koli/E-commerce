import React, {useEffect, useState} from 'react';
import API, { setToken } from '../api';
import Listing from './Listing';
import CartPage from './CartPage';
import { Link, useNavigate } from 'react-router-dom';

function App(){
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [token, setTok] = useState(() => localStorage.getItem('token'));
  const [route, setRoute] = useState('shop'); // 'shop' or 'cart'
  const navigate = useNavigate();

  useEffect(()=>{
    setToken(token);
    if(token){
      // fetch profile if needed
    }
  },[token]);

  function handleLogin({user, token}){
    setUser(user); setTok(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setToken(token);
    // after login, merge local cart into server cart
    mergeLocalCartToServer();
  }

  async function mergeLocalCartToServer(){
    const localCart = JSON.parse(localStorage.getItem('local_cart') || '[]');
    if(!token || localCart.length===0) return;
    try{
      for(const it of localCart){
        await API.post('/api/cart', { itemId: it.itemId, quantity: it.quantity });
      }
      localStorage.removeItem('local_cart');
    }catch(e){ console.error(e) }
  }

  function logout(){
    setUser(null); setTok(null); setToken(null);
    localStorage.removeItem('user'); localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="container">
      <header className="header">
        <h1>ShopMate</h1>
        <nav>
          <button onClick={()=>setRoute('shop')}>Shop</button>
          <button onClick={()=>setRoute('cart')}>Cart</button>
          {user ? <span>Hi {user.name || user.email} <button onClick={logout}>Logout</button></span>
                : <Link to="/login">Login</Link>}
        </nav>
      </header>
      <main>
        {route==='shop' ? <Listing /> : <CartPage onLoginNeeded={()=>navigate('/login')} />}
      </main>
    </div>
  );
}
export default App;
