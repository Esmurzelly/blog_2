import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className='flex-1 justify-center flex flex-col'>
        <h2 className='text-2xl'>Want to learn more about JavaScript?</h2>
        <p className='text-gray-500 my-2'>Checkout these resources with 100 JavaScript Projects</p>
        <Button className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-tl-xl rounded-bl-none'>
          <a href="#" target="_blank" rel='noopener noreferrer'>100 JavaScript Projects</a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtSjtynhlJLcf-snjNi9wi5tmQ_ZNZBnqObQ&s" alt="" />
      </div>
    </div>
  )
}

export default CallToAction