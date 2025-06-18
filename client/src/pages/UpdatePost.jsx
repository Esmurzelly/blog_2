import React, { useEffect, useState } from 'react';
import { TextInput, Select, FileInput, Button } from 'flowbite-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import defaultAvatar from '../assets/user.png'
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';

const UpdatePost = () => {
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({});
    const { postId } = useParams();
    const { currentUser } = useSelector(state => state.user);

    const navigate = useNavigate();

    const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);

        if (!res.ok) {
            toast.error('error in fetching');
        }

        if (res.ok) {
            toast.success('You got the post successfuly');
        }

        const data = await res.json();
        setFormData({ ...formData, ...data.posts[0] });
    };

    useEffect(() => {
        try {
            fetchPost();
        } catch (error) {
            toast.error(error.message);
        }
    }, []);

    const handleChangeImage = e => {
        const file = e.target.files[0];

        if (file && file.type.includes('image')) {
            setImage(file);

            // setFormData({ ...formData, image })

            console.log('formData.image from handleChange', formData.image);
        }
    }

    const handleChange = e => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();
            form.append('title', formData.title);
            form.append('content', formData.content);
            form.append('category', formData.category);

            if (image) {
                form.append('image', image);
            } else {
                form.append('image', formData.image);
            }

            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: "PUT",
                body: form,
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(`error - ${data.message}`);
                return;
            };

            if (res.ok) {
                toast.success("Post is updated")
                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            toast.error(error)
        }
    }

    if (!formData.image) return <Loader />

    return (
        <div className='p-3 max-w-3xl mx-auto'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Update the post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput value={formData.title} onChange={handleChange} type="text" placeholder="Title" required id="title" className="flex-1" />
                    <Select value={formData.category} id='category' onChange={handleChange}>
                        <option value='uncategorized'>Select a category</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nodejs'>Node.js</option>
                    </Select>
                </div>

                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput type='file' accept='image/*' onChange={handleChangeImage} />
                </div>
                {(!image && formData.image) && (
                    <img src={formData.image.includes('http') ? formData.image : `${import.meta.env.VITE_PROFILE_IMAGE_URL}/static/postImage/${formData.image}`} alt="" />
                )}

                {image && <img src={URL.createObjectURL(image)} alt="" />}

                <ReactQuill
                    id='content'
                    theme='snow'
                    placeholder='Write something...'
                    className='h-72 mb-12'
                    required
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    value={formData.content}
                />

                <Button type='submit ' className='p-5 bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer'>
                    Update post
                </Button>
            </form>
        </div>
    )
}

export default UpdatePost