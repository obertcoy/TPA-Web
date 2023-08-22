import { CgProfile } from "react-icons/cg";
import { Chat } from "../../../model/ChatModel";
import style from './css/UserChat.module.scss'
import PostCard from "./PostCard";
import { useQuery } from "@apollo/client";
import { Post } from "../../../model/PostModel";
import { GET_POST } from "../../../query/PostQuery";
import { useState } from "react";
import PostModal from "../modal/PostModal";

interface UserChatProps {
    data: Chat
}

export function OtherUserChat({ data }: UserChatProps) {

    const { data: postData } = useQuery<{ getPost: Post }>(GET_POST, {
        skip: !data?.post?.id,
        variables: {
            id: data?.post?.id
        },
    })

    const [openPostModal, setOpenPostModal] = useState(false)
    const [postModalID, setPostModalID] = useState<string>('')

    const handleOpenPostModal = (id: string) => {

        setOpenPostModal(true)
        setPostModalID(id)
    }

    const handleClosePostModal = () => {
        setOpenPostModal(false)
        setPostModalID('')
    }

    return (
        <>
            {openPostModal && postModalID && <PostModal postID={postModalID} handleClosePostModal={handleClosePostModal} />}

            <div className={style['other-chat-container']}>
                {data?.user.profileImageURL ? <img src={data.user.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                <div className={style['other-chat-subcontainer']}>
                    <h5>{data.user?.first_name + " " + data.user?.last_name}</h5>
                    <div className={style['other-chat-content']}>
                        {data?.text ?
                            <span>{data.text}</span>
                            :
                            (data?.fileURL?.includes('mp4')
                                ?
                                <video src={data.fileURL} controls className={style['file']}></video>
                                :
                                (data?.fileURL?.includes('mp3')
                                    ?
                                    <audio src={data.fileURL} controls className={style['file']}></audio>
                                    :
                                    (data.fileURL ?
                                        <img src={data.fileURL} alt="chat img" className={style['file']} />
                                        :
                                        null)
                                )
                            )
                        }
                        {postData?.getPost &&
                            <div className={style['post']}>
                                <PostCard data={postData.getPost} liked={postData.getPost.likedBy?.some(like => like.id === data.user?.id) || false} handleOpenPostModal={handleOpenPostModal} />
                            </div>}
                    </div>
                </div>

            </div>
        </>
    )

}

export function UserChat({ data }: UserChatProps) {

    const { data: postData } = useQuery<{ getPost: Post }>(GET_POST, {
        skip: !data?.post?.id,
        variables: {
            id: data?.post?.id
        },
    })

    const [openPostModal, setOpenPostModal] = useState(false)
    const [postModalID, setPostModalID] = useState<string>('')

    const handleOpenPostModal = (id: string) => {

        setOpenPostModal(true)
        setPostModalID(id)
    }

    const handleClosePostModal = () => {
        setOpenPostModal(false)
        setPostModalID('')
    }

    return (
        <>
            {openPostModal && postModalID && <PostModal postID={postModalID} handleClosePostModal={handleClosePostModal} />}
            <div className={style['chat-container']}>
                {data?.user.profileImageURL ? <img src={data.user.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                <div className={style['chat-subcontainer']}>
                    <h5>{data.user?.first_name + " " + data.user?.last_name}</h5>
                    <div className={style['chat-content']}>
                        {data?.text ?
                            <span>{data.text}</span>
                            :
                            (data?.fileURL?.includes('mp4')
                                ?
                                <video src={data.fileURL} controls className={style['file']}></video>
                                :
                                (data?.fileURL?.includes('mp3')
                                    ?
                                    <audio src={data.fileURL} controls className={style['file']}></audio>
                                    :
                                    (data.fileURL ?
                                        <img src={data.fileURL} alt="chat img" className={style['file']} />
                                        :
                                        null)
                                )
                            )
                        }
                        {postData?.getPost &&
                            <div className={style['post']}>
                                <PostCard data={postData.getPost} liked={postData.getPost.likedBy?.some(like => like.id === data.user?.id) || false} handleOpenPostModal={handleOpenPostModal} />
                            </div>
                        }
                    </div>
                </div>

            </div>
        </>
    )

}