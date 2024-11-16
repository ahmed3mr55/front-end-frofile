"use client";
import React from 'react'
import OtherPosts from '../slices/OtherPosts';


const forYou = () => {
  screenTop = () => window.scrollTo(0, 0);
  return (
    <>
      <OtherPosts />
    </>
  )
}

export default forYou;
