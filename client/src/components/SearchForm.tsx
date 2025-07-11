import { Button, Select, TextInput } from 'flowbite-react'
import React from 'react'

type Props = {
    onSubmit: (value: React.FormEvent<HTMLFormElement>) => void
    onChange: (value: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onClearFilter: (value: React.MouseEvent<HTMLButtonElement>) => void
    searchTerm: string;
    sort: string;
    category: string;
}

const SearchForm = React.memo(({ searchTerm, sort, category, onSubmit, onChange, onClearFilter }: Props) => {
    return (
        <form className='flex flex-col gap-8' onSubmit={onSubmit}>
            <div className='flex justify-between items-center gap-2'>
                <label className='whitespace-nowrap font-semibold w-1/2'>Search Term:</label>
                <TextInput
                    className='w-1/2'
                    placeholder='Search...'
                    id='searchTerm'
                    type='text'
                    value={searchTerm}
                    onChange={onChange}
                />
            </div>

            <div className='flex justify-between items-center gap-2'>
                <label className='font-semibold w-1/2'>Sort:</label>
                <Select className='w-1/2' value={sort} id='sort' onChange={onChange}>
                    <option value='desc'>Latest</option>
                    <option value='asc'>Oldest</option>
                </Select>
            </div>

            <div className='flex justify-between items-center gap-2'>
                <label className='font-semibold w-1/2'>Category:</label>
                <Select className='w-1/2' value={category} id='category' onChange={onChange}>
                    <option value=''>All Categories</option>
                    <option value='uncategorized'>Uncategorized</option>
                    <option value='reactjs'>React.js</option>
                    <option value='nextjs'>Next.js</option>
                    <option value='javascript'>JavaScript</option>
                    <option value='nodejs'>NodeJS</option>
                </Select>
            </div>

            <Button type='submit' className='cursor-pointer'>Apply Filters</Button>

            <Button type='button' className='bg-red-700! cursor-pointer' onClick={onClearFilter}>
                Clear Filters
            </Button>
        </form>
    )
});

export default SearchForm