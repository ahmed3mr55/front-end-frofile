import React from 'react'
import { cookies } from 'next/headers'
import './globals.css';
import Login from './login/Login';

const Home = () => {
  return (
    <>
      <Login />
    </>
  )
}

export default Home;
