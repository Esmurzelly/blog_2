import React, { useState } from 'react';
import { TextInput, Select, FileInput, Button } from 'flowbite-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../redux/posts/postSlice';
import { useAppDispatch } from '../redux/store';

interface IForm {
  title: string;
  category: string;
  content: string;
  image?: string;
}

const CreatePost = () => {
  const [image, setImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<IForm>({
    title: '',
    category: 'uncategorized',
    content: '',
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file && file.type.includes('image')) {
      setImage(file);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append('category', formData.category);
      form.append('content', formData.content);
      if (image) form.append('image', image);

      if (!formData.content.trim()) {
        toast.error('Content is required');
        return;
      }

      const response = await dispatch(createPost({ form })).unwrap();
      navigate(`/post/${response._id}`);
    } catch (error: any) {
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
            <option value='nextjs'>NextJS</option>
            <option value='nodejs'>NodeJS</option>
          </Select>
        </div>

        <div className="border-4 border-teal-500 border-dotted p-3">
          <FileInput accept='image/*' onChange={handleChangeImage} />
        </div>
        {image && <img className='w-24' src={URL.createObjectURL(image)} alt="post image" />}

        <ReactQuill
          id='content'
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        <Button type='submit' className='p-5 bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer'>Publish</Button>
      </form>
    </div>
  )
}

export default CreatePost