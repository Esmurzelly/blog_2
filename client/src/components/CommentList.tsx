import React from 'react'
import { IComment } from '../types/types';
import Comment from './Comment';

type CommentListProps = {
    comments: IComment[];
    onLike: (commentId: string | number) => void;
    onDelete: (commentId: string | number) => void;

}

const CommentList = React.memo(({ comments, onLike, onDelete }: CommentListProps) => {
    if (comments.length === 0) {
        return <p className='text-sm my-5'>No comments yet</p>;
    }

    return (
        <>
            <div className='text-sm my-5 flex items-center gap-1'>
                <p>Comments</p>
                <div className="border border-gray-400 py-1 px-2 rounded-sm">
                    <p>{comments.length}</p>
                </div>
            </div>

            {comments.map((commentItem) => (
                <Comment
                    key={commentItem?._id}
                    comment={commentItem}
                    onLike={onLike}
                    onDelete={onDelete}
                />
            ))}
        </>
    )
})

export default CommentList