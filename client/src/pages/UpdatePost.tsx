import React, { useEffect, useState } from 'react';
import { TextInput, Select, FileInput, Button } from 'flowbite-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import defaultAvatar from '../assets/user.png'
import Loader from '../components/Loader';
import { updatePost, getCurrentPost } from '../redux/posts/postSlice';

const UpdatePost = () => {
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({});
    const { postId } = useParams();
    const { currentUser } = useSelector(state => state.user);
    const { currentPost } = useSelector(state => state.posts);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        try {
            const fetchPost = async () => {
                const response = await dispatch(getCurrentPost({ postId })).unwrap(); // ?

                setFormData({ ...formData, ...response.posts[0] })
                toast.success('You got the post successfuly');
            };

            fetchPost();
        } catch (error) {
            toast.error(error.message);
        }
    }, []);

    const handleChangeImage = e => {
        const file = e.target.files[0];

        if (file && file.type.includes('image')) {
            setImage(file);
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

            const response = await dispatch(updatePost({ form, formDataId: formData._id, currentUserId: currentUser._id }));

            toast.success("Post is updated")
            navigate(`/post/${formData._id}`);
        } catch (error) {
            toast.error(error)
        }
    }

    if (!formData.image) return <Loader />
    if (!currentPost) return <h1>Post not found</h1>

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