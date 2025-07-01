import React, { Suspense } from 'react'
import Header from './Header'
import FooterComponent from './Footer'
import { Outlet } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import ScrollToTop from './ScrollToTop';
import Loader from './Loader';

const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen bg-white dark:bg-[#212936] dark:text-white'>
      <ScrollToTop />
      <Header />

      <main className='flex-1'>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
        <ToastContainer />
      </main>

      <FooterComponent />
    </div>
  )
}

export default Layout