import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { ShowUser, User } from "../../../model/UserModel";
import style from './css/SharePostModal.module.scss'
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { UserName } from "../../../helper/UserHelper";
import { IoIosClose } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { CgProfile } from "react-icons/cg";
import { GET_USER } from "../../../query/UserQuery";
import { getCurrentUser } from "../MasterLayout";
import { SHARE_POST } from "../../../query/PostQuery";


interface SharePostModalProps {
    postID: string
    handleOpenShareModal: () => void
}

export function SharePostModal({ postID, handleOpenShareModal }: SharePostModalProps) {

    const user = getCurrentUser()

    const { data } = useQuery<{ getUser: User }>(GET_USER, {
        variables: {
            id: user?.id
        },
    })

    const [sharePost] = useMutation(SHARE_POST)

    const [shared, setShared] = useState<ShowUser[]>([])

    const [searchFriend, setSearchFriend] = useState('');
    const filteredFriends = data?.getUser.friend.filter(friend =>
        (friend.first_name + " " + friend.last_name).toLowerCase().includes(searchFriend.toLowerCase())
    ) || []

    const handleShare = (user: ShowUser) => {

        if (!shared.includes(user)) {
            setShared(prev => [...prev, user]);
        }
    }

    const handleRemoveShared = (user: ShowUser) => {
        setShared(prev => prev.filter(shared => shared != user))
    }

    const handleInvite = async () => {
        const invitePromises = shared.map(async (user) => {
            await sharePost({
                variables: {
                    postID: postID,
                    sharedTo: user.id
                }
            });
        });

        try {
            await Promise.all(invitePromises);
            toast.success('Post shared successfully!');
            handleOpenShareModal();
        } catch (error) {
            toast.error('Share post failed. Please try again.');
        }

    };

    return (
        <div className={style['page-container']}>
            <div className={style['share-form-container']}>
                <div className={style['share-form-title']}>
                    <BiArrowBack id={style['back-icon']} onClick={handleOpenShareModal} />
                    <h4>Share Post</h4>
                </div>
                <hr />
                <div className={style['share-form-body']}>
                    <div className={style['share-search-container']}>
                        <div className={style['share-search']}>
                            <AiOutlineSearch id={style['search-icon']} />
                            <input type="text" placeholder='Search Friends' value={searchFriend} onChange={(e) => setSearchFriend(e.target.value)} />
                        </div>
                        <h5 onClick={handleInvite}>Done</h5>
                    </div>
                    {shared.length > 0
                        &&
                        <div className={style['shared-container']}>
                            <h5>Shared</h5>
                            <div className={style['shared-user-container']}>
                                {shared.map((user) => (
                                    <div key={user.id} className={style['shared-user']}>
                                        {UserName(user)}
                                        <IoIosClose className={style['remove-icon']} onClick={() => handleRemoveShared(user)} />
                                    </div>
                                ))
                                }
                            </div>
                        </div>
                    }
                    <div className={style['user-card-container']}>
                        <h5>Suggestions</h5>
                        {
                            filteredFriends.length ?
                                filteredFriends.map((data) => (
                                    <div key={data.id} onClick={() => handleShare(data)}>
                                        {data.profileImageURL ? <img src={data.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                                        <h5>{UserName(data)}</h5>
                                    </div>
                                ))
                                : <h5 style={{ color: "gray" }}>No friends...</h5>
                        }
                    </div>
                </div>
                <ToastContainer position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored" />
            </div>
        </div >
    )
}