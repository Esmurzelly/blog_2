import React from 'react'
import Header from './Header'
import FooterComponent from './Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
        <Header />

        <main className='flex-1'>
            <Outlet />
        </main>

        <FooterComponent />
    </div>
  )
}

export default Layout