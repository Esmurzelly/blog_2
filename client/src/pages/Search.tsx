import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPosts } from '../redux/posts/postSlice';
import { RootState, useAppDispatch } from '../redux/store';
import Loader from '../components/Loader';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import SearchForm from '../components/SearchForm';
import { toast } from 'react-toastify';

type ISidebar = {
    searchTerm: string,
    sort: string,
    category: string
}

const Search = () => {
    const [sidebarData, setSidebarData] = useState<ISidebar>({
        searchTerm: '',
        sort: 'desc',
        category: ''
    });

    const { posts, totalPosts, loading } = useSelector((state: RootState) => state.posts);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [startIndex, setStartIndex] = useState<number>(9);

    const [pageNumber, setPageNumber] = useState<number>(1);
    const POSTS_PER_PAGE: number = 9;

    const fetchPostsByPage = useCallback(async (page: number) => {
        const newStartIndex = (page - 1) * POSTS_PER_PAGE;

        try {
            const urlParams = new URLSearchParams(location.search);
            urlParams.set('startIndex', String(newStartIndex));
            const searchQuery = urlParams.toString();

            dispatch(getPosts({ searchQuery }));

            setStartIndex(newStartIndex);
            setPageNumber(page);
        } catch (error: any) {
            console.log(error.message);
            toast.error("Unable to load posts");
        }
    }, [dispatch, location.search]);

    const handleShowMore = useCallback(() => {
        fetchPostsByPage(pageNumber + 1);
    }, [fetchPostsByPage, pageNumber]);

    const handleShowBack = useCallback(() => {
        fetchPostsByPage(pageNumber - 1);
    }, [fetchPostsByPage, pageNumber]);

    const handleGoToStart = useCallback(() => {
        fetchPostsByPage(1);
    }, [fetchPostsByPage]);

    const handleGoToEnd = useCallback(() => {
        fetchPostsByPage(Math.ceil(totalPosts / POSTS_PER_PAGE));
    }, [fetchPostsByPage, totalPosts]);

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

        fetchPostsByPage(1);
    }, [location.search])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.target.id === 'searchTerm') setSidebarData({ ...sidebarData, searchTerm: e.target.value });

        if (e.target.id === 'sort') {
            const sort = e.target.value || 'desc';
            setSidebarData({ ...sidebarData, sort });
        }

        if (e.target.id === 'category') {
            const category = e.target.value || '';
            setSidebarData({ ...sidebarData, category });
        }
    }, [navigate, sidebarData])

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(location.search);

        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);

        if (sidebarData.category) {
            urlParams.set('category', sidebarData.category);

            if (sidebarData.category === 'uncategorized') {
                urlParams.set('category', 'undefined');
            }
        } else {
            urlParams.delete('category')
        }

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }, [sidebarData]);

    const handleClearFilter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setSidebarData({
            searchTerm: '',
            sort: 'desc',
            category: ''
        });

        navigate('/search');
    }, [sidebarData, setSidebarData])

    if (loading) return <Loader />

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
                <SearchForm
                    category={sidebarData.category}
                    searchTerm={sidebarData.searchTerm}
                    sort={sidebarData.sort || 'desc'}
                    onClearFilter={handleClearFilter}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />
            </div>

            <div className='w-full'>
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3'>
                    Posts results:
                </h1>

                <div className='p-7 grid grid-cols-3 grid-rows-3 gap-5'>
                    {!loading && (posts && posts.length === 0) && (
                        <p className='text-xl text-gray-500'>No posts found.</p>
                    )}
                    {loading && <p className='text-xl text-gray-500'>Loading...</p>}

                    {!loading && posts && posts.map((postItem) => <PostCard key={postItem._id} post={postItem} />)}
                </div>

                <Pagination
                    pageNumber={pageNumber}
                    totalItem={totalPosts}
                    onFetchData={fetchPostsByPage}
                    onStart={handleGoToStart}
                    onEnd={handleGoToEnd}
                    onShowMore={handleShowMore}
                    onShowLess={handleShowBack}
                />
            </div>
        </div>
    )
}

export default Search