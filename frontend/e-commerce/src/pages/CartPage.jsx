import React, {useEffect, useState} from 'react';
import API from '../api';

export default function CartPage({ onLoginNeeded }){
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(()=>{ load(); },[]);

  async function load(){
    if(!token){
      // show local cart
      const local = JSON.parse(localStorage.getItem('local_cart') || '[]');
      // fetch item details for ids
      const ids = local.map(l=>l.itemId);
      const items = [];
      for(const id of ids){
        try{ const r = await API.get(`/api/items/${id}`); items.push({...r.data, quantity: local.find(l=>l.itemId===id).quantity}); }
        catch(e){}
      }
      setCart(items);
      return;
    }
    try{
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await API.get('/api/cart');
      setCart(res.data);
    }catch(err){
      console.error(err);
    }
  }

  async function update(itemId, qty){
    if(!token){
      const local = JSON.parse(localStorage.getItem('local_cart') || '[]');
      const idx = local.findIndex(l=>l.itemId===itemId);
      if(idx>=0){
        if(qty<=0) local.splice(idx,1);
        else local[idx].quantity = qty;
      }
      localStorage.setItem('local_cart', JSON.stringify(local));
      load();
      return;
    }
    await API.post('/api/cart', { itemId, quantity: qty });
    load();
  }

  async function remove(itemId){
    if(!token){
      const local = JSON.parse(localStorage.getItem('local_cart') || '[]').filter(l=>l.itemId!==itemId);
      localStorage.setItem('local_cart', JSON.stringify(local));
      load();
      return;
    }
    await API.delete(`/api/cart/${itemId}`);
    load();
  }

  if(cart.length === 0) return <div>Your cart is empty.</div>;

  const total = cart.reduce((s,it)=> s + (it.price||0) * (it.quantity||1), 0);

  return (
    <div>
      <h2>Your Cart</h2>
      <ul className="cart-list">
        {cart.map(it=>(
          <li key={it.id}>
            <div><strong>{it.title}</strong> — ₹{it.price}</div>
            <div>
              <button onClick={()=>update(it.id, (it.quantity||1)-1)}>-</button>
              <span>{it.quantity||1}</span>
              <button onClick={()=>update(it.id, (it.quantity||1)+1)}>+</button>
              <button onClick={()=>remove(it.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="checkout">Total: ₹{total.toFixed(2)}</div>
    </div>
  )
}
