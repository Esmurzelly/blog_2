import React from 'react'
import { Button, Textarea } from 'flowbite-react';

type Props = {
    onSubmit: (value: React.FormEvent<HTMLFormElement>) => void
    commentContent: string;
    setComment: any
}

const CommentForm = React.memo(({ onSubmit, commentContent, setComment }: Props) => {
    return (
        <form onSubmit={onSubmit} className='border border-teal-500 rounded-md p-3'>
            <Textarea
                placeholder='Add a comment...'
                // @ts-ignore
                type='text'
                rows={3}
                maxLength={200}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                value={commentContent}
            />

            <div className="flex justify-between items-center mt-5">
                <p className='text-gray-500 text-xs'>{200 - commentContent.length} characters remaining</p>
                <Button outline className='bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer text-white!' type='submit'>Submit</Button>
            </div>
        </form>
    )
});

export default CommentForm