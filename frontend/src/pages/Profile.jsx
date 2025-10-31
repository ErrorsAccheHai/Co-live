import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/user';
const tokenKey = 'colive_token';

export default function Profile(){
  const [user,setUser] = useState(null);
  const [form,setForm] = useState({ name:'', password:'' });

  useEffect(()=>{ fetchUser(); },[]);

  const fetchUser = async ()=>{
    const token = localStorage.getItem(tokenKey);
    const res = await axios.get(`${API}/me`,{ headers:{ Authorization:`Bearer ${token}` }});
    setUser(res.data);
  };

  const updateProfile = async (e)=>{
    e.preventDefault();
    const token = localStorage.getItem(tokenKey);
    await axios.put(`${API}/me`, form,{ headers:{ Authorization:`Bearer ${token}` }});
    alert('Profile updated');
    fetchUser();
  };

  if(!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <form onSubmit={updateProfile}>
        <input name="name" placeholder="New Name" value={form.name} onChange={e=>setForm({...form,[e.target.name]:e.target.value})} />
        <input name="password" type="password" placeholder="New Password" value={form.password} onChange={e=>setForm({...form,[e.target.name]:e.target.value})} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
