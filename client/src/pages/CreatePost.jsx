import React, { useState } from 'react';
import { TextInput, Select, FileInput, Button } from 'flowbite-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const CreatePost = () => {
  const [value, setValue] = useState('');

  return (
    <div className='p-3 max-w-3xl mx-auto'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4'>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type="text" placeholder="Title" required id="title" className="flex-1" />
          <Select>
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nodejs'>Node.js</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type='file' accept='image/*' />
          <Button type='button' size='sm' className='p-5 bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer'>Upload Image</Button>
        </div>
        <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' required />

        <Button type='submit 'className='p-5 bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer'>Publish</Button>

      </form>
    </div>
  )
}

export default CreatePost