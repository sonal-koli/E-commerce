import React, {useState} from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const {data} = await API.post('/api/auth/signup',{email,password,name});
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      navigate('/');
      location.reload();
    }catch(err){
      alert(err.response?.data?.error || 'Signup failed');
    }
  }

  return (
  <div className="auth-card">
    <h2>Signup</h2>
    <form onSubmit={submit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Signup</button>
    </form>
  </div>
);
}
