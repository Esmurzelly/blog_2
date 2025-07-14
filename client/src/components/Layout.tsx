import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import FooterComponent from './Footer'
import ScrollToTop from './ScrollToTop';
import Loader from './Loader';
import { ToastContainer } from 'react-toastify';

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