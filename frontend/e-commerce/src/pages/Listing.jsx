import React, {useEffect, useState} from 'react';
import API from '../api';

export default function Listing(){
  const [items, setItems] = useState([]);
  const [q,setQ] = useState('');
  const [category,setCategory] = useState('');
  const [minPrice,setMinPrice] = useState('');
  const [maxPrice,setMaxPrice] = useState('');

  useEffect(()=>{ fetchItems(); },[]);

  async function fetchItems(){
    const params = {};
    if(q) params.q = q;
    if(category) params.category = category;
    if(minPrice) params.minPrice = minPrice;
    if(maxPrice) params.maxPrice = maxPrice;
    const res = await API.get('/api/items',{params});
    setItems(res.data);
  }

  function addToCart(item){
    const token = localStorage.getItem('token');
    if(!token){
      // save locally until user logs in
      const local = JSON.parse(localStorage.getItem('local_cart') || '[]');
      const found = local.find(l=>l.itemId === item.id);
      if(found) found.quantity += 1;
      else local.push({itemId: item.id, quantity: 1});
      localStorage.setItem('local_cart', JSON.stringify(local));
      alert('Added to cart (saved locally). Login to persist.');
      return;
    }
    API.post('/api/cart', { itemId: item.id, quantity: 1}).then(()=> alert('Added to cart'));
  }

  return (
    <div>
      <div className="filters">
        <input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
        <input placeholder="category" value={category} onChange={e=>setCategory(e.target.value)} />
        <input placeholder="min" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
        <input placeholder="max" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
        <button onClick={fetchItems}>Filter</button>
      </div>

      <div className="grid">
        {items.map(it=>(
          <div key={it.id} className="card">
            <h3>{it.title}</h3>
            <p>{it.description}</p>
            <p>Category: {it.category}</p>
            <p>₹{it.price}</p>
            <button onClick={()=>addToCart(it)}>Add to cart</button>
          </div>
        ))}
      </div>
    </div>
  )
}
