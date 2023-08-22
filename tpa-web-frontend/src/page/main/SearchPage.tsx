import { useState } from 'react'
import style from '../css/SearchPage.module.scss'
import { useMutation, useQuery } from '@apollo/client'
import 'react-toastify/dist/ReactToastify.css';
import { getCurrentUser } from '../component/MasterLayout'
import { BsFillChatLeftTextFill } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom';
import { FaGlobeAsia } from 'react-icons/fa';
import { MdGroup, MdGroups } from 'react-icons/md';
import { GET_SEARCH_RESULT } from '../../query/SearchQuery';
import { SearchResult } from '../../model/SearchModel';
import { ShowUser, User } from '../../model/UserModel';
import { CgProfile } from 'react-icons/cg';
import { GO_TO_CHATROOM } from '../../query/ChatQuery';
import { UserName } from '../../helper/UserHelper';
import { ShowGroup } from '../../model/GroupModel';
import PostCard from '../component/card/PostCard';
import PostModal from '../component/modal/PostModal';


export default function SearchPage() {

    const { search } = useParams()
    const user = getCurrentUser()
    const navigate = useNavigate()

    const { data: searchResult, loading: searchLoading } = useQuery<{ getSearchResult: SearchResult }>(GET_SEARCH_RESULT, {
        variables: {
            search: search
        }
    })
    const [goToChatRoom, { data: chatRoomData }] = useMutation(GO_TO_CHATROOM)

    const [filter, setFilter] = useState('all')

    // Peoples
    const toUserProfile = (userID: string) => {
        navigate(`/main/profile/${userID}`)
    }

    const handleGoToChatRoom = async (userID: string) => {
        await goToChatRoom({
            variables: {
                inputChatRoom: {
                    userID: [user?.id, userID]
                }
            }
        })
        if (chatRoomData) {
            navigate(`/main/chats/${chatRoomData.goToChatRoom.id}`)
        }
    }

    // Groups

    const toGroupProfile = (groupID: string) => {
        navigate(`/main/groups/${groupID}`)
    }

    // Posts

    const [openPostModal, setOpenPostModal] = useState(false)
    const [postModalID, setPostModalID] = useState('')

    const handleOpenPostModal = (id: string) => {

        setOpenPostModal(true)
        setPostModalID(id)
    }

    const handleClosePostModal = () => {
        setOpenPostModal(false)
        setPostModalID('')
    }

    if (searchLoading) {
        return <h4>Loading...</h4>
    }

    return (
        <div className={style['page-container']}>
            {openPostModal ? <PostModal postID={postModalID} handleClosePostModal={handleClosePostModal} /> : null}
            <div className={style['sidebar-container']}>
                <div className={style['sidebar']}>
                    <h3>Search Results</h3>
                    <hr />
                    <h4>Filters</h4>
                    <div className={filter == 'all' ? style['filter-active'] : style['filter']} onClick={() => setFilter('all')}>
                        <FaGlobeAsia className={style['filter-icon']} />
                        <h4>All</h4>
                    </div>
                    <div className={filter == 'posts' ? style['filter-active'] : style['filter']} onClick={() => setFilter('posts')}>
                        <BsFillChatLeftTextFill className={style['filter-icon']} />
                        <h4>Posts</h4>
                    </div>
                    <div className={filter == 'peoples' ? style['filter-active'] : style['filter']} onClick={() => setFilter('peoples')}>
                        <MdGroup className={style['filter-icon']} />
                        <h4>Peoples</h4>
                    </div>
                    <div className={filter == 'groups' ? style['filter-active'] : style['filter']} onClick={() => setFilter('groups')}>
                        <MdGroups className={style['filter-icon']} />
                        <h4>Groups</h4>
                    </div>
                </div>

            </div>
            <div className={style['page-subcontainer']}>
                <div className={style['page-content']}>
                    {(filter == 'all' || filter == 'peoples') && searchResult?.getSearchResult.users.length ?
                        searchResult?.getSearchResult.users.map((data) => (
                            <UserSearchCard key={data.id} data={data} user={user as User} toUserProfile={toUserProfile} handleGoToChatRoom={handleGoToChatRoom} />
                        )) : null}
                    {(filter == 'all' || filter == 'groups') && searchResult?.getSearchResult.groups.length ?
                        searchResult.getSearchResult.groups.map((data) => (
                            <GroupSearchCard key={data.id} data={data} toGroupProfile={toGroupProfile} />
                        )) : null}
                    {(filter == 'all' || filter == 'posts') && searchResult?.getSearchResult.posts.length ?
                        (
                            <div className={style['post-card-container']}>
                                {searchResult.getSearchResult.posts.map((data) => (
                                    <PostCard key={data.id} data={data} handleOpenPostModal={handleOpenPostModal} liked={data.likedBy?.some(like => like.id === user?.id) || false} />
                                ))}
                            </div>
                        ) : null}
                </div>
            </div>

        </div >
    )

}

interface UserSearchCardProps {
    data: ShowUser
    user: User
    toUserProfile: (userID: string) => void
    handleGoToChatRoom: (userID: string) => Promise<void>
}

function UserSearchCard({ data, user, toUserProfile, handleGoToChatRoom }: UserSearchCardProps) {

    const handleChatRoom = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        await handleGoToChatRoom(data.id)
        console.log('test');
    }


    return (
        <div className={style['user-card']} onClick={() => toUserProfile(data.id)}>
            {data?.profileImageURL ? <img src={data?.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
            <div className={style['user-card-detail']}>
                <h4>{UserName(data)}</h4>
                <h5>mutual</h5>
            </div>
            {
                data.id != user.id &&
                <button onClick={(e) => handleChatRoom(e)}>Message</button>
            }
        </div>
    )
}

interface GroupSearchCardProps {
    data: ShowGroup
    toGroupProfile: (groupID: string) => void
}

function GroupSearchCard({ data, toGroupProfile }: GroupSearchCardProps) {

    return (
        <div className={style['group-card']} onClick={() => toGroupProfile(data.id)}>
            {data.bannerImageURL ? <img src={data.bannerImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
            <div className={style['group-card-detail']}>
                <h4>{data.name}</h4>
            </div>
            <button>Visit</button>
        </div>
    )
}

