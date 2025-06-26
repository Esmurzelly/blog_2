import { useEffect, useState } from 'react'
import { Button, Select, TextInput } from 'flowbite-react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../redux/posts/postSlice';

const Search = () => {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: ''
    });

    const { posts, totalPosts, loading } = useSelector(state => state.posts);
    const [showMore, setShowMore] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [startIndex, setStartIndex] = useState(9);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);

        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');

        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData(prev => ({
                ...prev,
                searchTerm: searchTermFromUrl || '',
                sort: sortFromUrl || '',
                category: categoryFromUrl || '',
            }));
        };

        const fetchPosts = async () => {
            const searchQuery = urlParams.toString();
            urlParams.set('startIndex', 0);

            const response = await dispatch(getPosts({ searchQuery }));
            setStartIndex(9);

            if (response.payload.posts.length >= totalPosts) {
                setShowMore(false);
            } else {
                setShowMore(true);
            }
        }

        fetchPosts();
    }, [location.search])

    const handleChange = e => {
        if (e.target.id === 'searchTerm') setSidebarData({ ...sidebarData, searchTerm: e.target.value });

        if (e.target.id === 'sort') {
            const order = e.target.value || 'desc';
            setSidebarData({ ...sidebarData, sort: order });
        }

        if (e.target.id === 'category') {
            const category = e.target.value || '';
            setSidebarData({ ...sidebarData, category });
        }
    }

    const handleSubmit = e => {
        e.preventDefault();

        const urlParams = new URLSearchParams(location.search);

        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);

        if (sidebarData.category) {
            urlParams.set('category', sidebarData.category);
        } else {
            urlParams.delete('category')
        }

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const handleClearFilter = e => {
        e.preventDefault();

        setSidebarData({
            searchTerm: '',
            sort: 'desc',
            category: ''
        });

        navigate('/search');
    }

    const handleShowMore = async () => {
        if (startIndex >= totalPosts) return;

        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);

        const searchQuery = urlParams.toString();

        const response = await dispatch(getPosts({ searchQuery }));

        const newPosts = response.payload.posts || [];
        setStartIndex(prev => prev + 9);

        if (startIndex + newPosts.length >= totalPosts) {
            setShowMore(false)
        } else {
            setShowMore(true)
        }
    };

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                    <div className='flex   items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <TextInput
                            placeholder='Search...'
                            id='searchTerm'
                            type='text'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <Select value={sidebarData.sort} id='sort' onChange={handleChange}>
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </Select>
                    </div>

                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Category:</label>
                        <Select value={sidebarData.category} id='category' onChange={handleChange}>
                            <option value=''>All Categories</option>
                            <option value='uncategorized'>Uncategorized</option>
                            <option value='reactjs'>React.js</option>
                            <option value='nextjs'>Next.js</option>
                            <option value='javascript'>JavaScript</option>
                        </Select>
                    </div>

                    <Button type='button' onClick={handleSubmit}>
                        Apply Filters
                    </Button>

                    <Button type='button' className='bg-red-700!' onClick={handleClearFilter}>
                        Clear Filters
                    </Button>
                </form>
            </div>

            <div className='w-full'>
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
                    Posts results:
                </h1>

                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && (posts && posts.length === 0) && (
                        <p className='text-xl text-gray-500'>No posts found.</p>
                    )}
                    {loading && <p className='text-xl text-gray-500'>Loading...</p>}

                    {!loading && posts && posts.map((postItem) => <PostCard key={postItem._id} post={postItem} />)}

                    {showMore && (
                        <button onClick={handleShowMore} className='text-teal-500 text-lg hover:underline p-7 w-full'>
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Search