import React from 'react'
import { FaAngleLeft, FaAngleRight, FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'

const Pagination = ({ totalItem, onStart, onEnd, onShowMore, onShowLess, pageNumber, onFetchData }) => {
  const ITEMS_PER_PAGE = 9;
    return (
        <div className="flex justify-center items-center mt-4 gap-2 p-10">
            <div className="mr-3 flex items-center">
                <FaAnglesLeft className='w-6 cursor-pointer' onClick={onStart} />
                <FaAngleLeft className='w-6 cursor-pointer' onClick={onShowLess} />
            </div>

            {[...Array(Math.ceil(totalItem / ITEMS_PER_PAGE)).keys()].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onFetchData(i + 1)}
                    className={`cursor-pointer text-sm px-3 py-1 rounded transition ${pageNumber === i + 1
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-500 dark:hover:bg-gray-700'
                        }`}
                >
                    {i + 1}
                </button>
            ))}

            <div className="ml-3 flex items-center">
                <FaAngleRight className='w-6 cursor-pointer' onClick={onShowMore} />
                <FaAnglesRight className='w-6 cursor-pointer' onClick={onEnd} />
            </div>
        </div>
    )
}

export default Pagination