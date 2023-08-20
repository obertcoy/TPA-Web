import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_NON_MEMBER_USER, INVITE_FRIEND } from "../../../query/GroupQuery";
import { ShowUser } from "../../../model/UserModel";
import style from './css/InviteGroupModal.module.scss'
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { UserName } from "../../../helper/UserHelper";
import { IoIosClose } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { CgProfile } from "react-icons/cg";


interface InviteGroupModalProps {
    groupID: string
    handleOpenInviteModal: () => void
}

export function InviteGroupModal({ groupID, handleOpenInviteModal }: InviteGroupModalProps) {

    const { data } = useQuery<{ getNonMemberUser: ShowUser[] }>(GET_NON_MEMBER_USER, {
        variables: {
            groupID: groupID
        }
    })

    const [inviteFriend] = useMutation(INVITE_FRIEND)

    const [invited, setInvited] = useState<ShowUser[]>([])

    const [searchFriend, setSearchFriend] = useState('');
    const filteredFriends = data?.getNonMemberUser.filter(friend =>
        (friend.first_name + " " + friend.last_name).toLowerCase().includes(searchFriend.toLowerCase())
    ) || []

    const handleAddInvited = (user: ShowUser) => {

        if (!invited.includes(user)) {
            setInvited(prev => [...prev, user]);
        }
    }

    const handleRemoveInvited = (user: ShowUser) => {
        setInvited(prev => prev.filter(invited => invited != user))
    }

    const handleInvite = async () => {
        const invitePromises = invited.map(async (user) => {
            await inviteFriend({
                variables: {
                    groupID: groupID,
                    userID: user.id
                }
            });
        });

        try {
            await Promise.all(invitePromises);
            toast.success('All invitations sent successfully!');
            handleOpenInviteModal();
        } catch (error) {
            toast.error('Invitation failed. Please try again.');
        }

    };

    return (
        <div className={style['page-container']}>
            <div className={style['invite-form-container']}>
                <div className={style['invite-form-title']}>
                    <BiArrowBack id={style['back-icon']} onClick={handleOpenInviteModal} />
                    <h4>Invite People</h4>
                </div>
                <hr />
                <div className={style['invite-form-body']}>
                    <div className={style['invite-search-container']}>
                        <div className={style['invite-search']}>
                            <AiOutlineSearch id={style['search-icon']} />
                            <input type="text" placeholder='Search Friends' value={searchFriend} onChange={(e) => setSearchFriend(e.target.value)} />
                        </div>
                        <h5 onClick={handleInvite}>Done</h5>
                    </div>
                    {invited.length > 0
                        &&
                        <div className={style['invited-container']}>
                            <h5>Invited</h5>
                            <div className={style['invited-user-container']}>
                                {invited.map((user) => (
                                    <div key={user.id} className={style['invited-user']}>
                                        {UserName(user)}
                                        <IoIosClose className={style['remove-icon']} onClick={() => handleRemoveInvited(user)} />
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
                                    <div key={data.id} onClick={() => handleAddInvited(data)}>
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