import React, {useState} from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const {data} = await API.post('/api/auth/login',{email,password});
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      // after login, we redirect to home
      navigate('/');
      // merging of local cart handled in App on mount
      location.reload();
    }catch(err){
      alert(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/>
        <button type="submit">Login</button>
      </form>
      <p>Or <a href="/signup">Signup</a></p>
    </div>
  )
}
