import React from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'

const ChangeThemeButton = ({ onHandleSwitchTheme, theme }) => {
    return (
        <button
            onClick={onHandleSwitchTheme}
            className='w-12 h-10 flex justify-center items-center cursor-pointer bg-white px-2 py-1 rounded-sm text-sm text-black outline dark:bg-gray-300 dark:text-black'>
                { theme === 'light' ? <FaMoon className='w-5' /> : <FaSun className='w-5' /> }
        </button>
    )
}

export default ChangeThemeButton