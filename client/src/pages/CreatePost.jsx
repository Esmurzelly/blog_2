import React, { useState } from 'react';
import { TextInput, Select, FileInput, Button } from 'flowbite-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [value, setValue] = useState('');
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChangeImage = e => {
    const file = e.target.files[0];

    if (file && file.type.includes('image')) {
      setImage(file);
      // setFormData({ ...formData, image, })
    }
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append('category', formData.category);
      form.append('content', formData.content);
      if (image) form.append('image', image);

      const res = await fetch('/api/post/create', {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(`error - ${data.message}`);
        return;
      };

      if (res.ok) {
        toast.success("Post is published")
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <div className='p-3 max-w-3xl mx-auto'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput onChange={handleChange} type="text" placeholder="Title" required id="title" className="flex-1" />
          <Select id='category' onChange={handleChange}>
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nodejs'>Node.js</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type='file' accept='image/*' onChange={handleChangeImage} />
          <Button type='button' size='sm' className='p-5 bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer'>Upload Image</Button>
        </div>
        {image && <img className='w-24' src={URL.createObjectURL(image)} alt="post image" />}

        <ReactQuill
          id='content'
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        <Button type='submit ' className='p-5 bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer'>Publish</Button>
      </form>
    </div>
  )
}

export default CreatePost