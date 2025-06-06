import React from 'react'
import Header from './Header'
import FooterComponent from './Footer'
import { Outlet } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import ScrollToTop from './ScrollToTop';

const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <ScrollToTop />
      <Header />

      <main className='flex-1'>
        <Outlet />
        <ToastContainer />
      </main>

      <FooterComponent />
    </div>
  )
}

export default Layout