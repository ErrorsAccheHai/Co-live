import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/request';
const tokenKey = 'colive_token';

export default function Requests(){
  const [requests,setRequests] = useState([]);
  const [title,setTitle] = useState('');
  const [desc,setDesc] = useState('');
  const [role,setRole] = useState('');

  useEffect(()=>{
    getUserRole();
  },[]);

  const getUserRole = async ()=>{
    const token = localStorage.getItem(tokenKey);
    const res = await axios.get('http://localhost:5000/api/auth/me',{ headers:{ Authorization:`Bearer ${token}` }});
    setRole(res.data.role);
    loadRequests(res.data.role);
  };

  const loadRequests = async (r)=>{
    const token = localStorage.getItem(tokenKey);
    const url = r==='landlord'? API : `${API}/my`;
    const res = await axios.get(url,{ headers:{ Authorization:`Bearer ${token}` }});
    setRequests(res.data);
  };

  const createRequest = async (e)=>{
    e.preventDefault();
    const token = localStorage.getItem(tokenKey);
    await axios.post(API,{ title, description:desc },{ headers:{ Authorization:`Bearer ${token}` }});
    setTitle(''); setDesc('');
    loadRequests(role);
  };

  const updateStatus = async (id,status)=>{
    const token = localStorage.getItem(tokenKey);
    await axios.put(`${API}/${id}`,{ status },{ headers:{ Authorization:`Bearer ${token}` }});
    loadRequests(role);
  };

  return (
    <div className="container">
      <h2>Maintenance Requests</h2>
      {role==='tenant' &&
        <form onSubmit={createRequest}>
          <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
          <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
          <button type="submit">Submit Request</button>
        </form>
      }
      <ul>
        {requests.map(r=>(
          <li key={r._id} style={{marginTop:'1rem',border:'1px solid #ccc',padding:'1rem'}}>
            <strong>{r.title}</strong><br/>
            {r.description}<br/>
            Status: {r.status}<br/>
            {role==='landlord' &&
              <div>
                <button onClick={()=>updateStatus(r._id,'In Progress')}>In Progress</button>
                <button onClick={()=>updateStatus(r._id,'Resolved')}>Resolved</button>
              </div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
