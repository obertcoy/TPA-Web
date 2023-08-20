import { useState, useEffect } from 'react'
import style from '../css/ChatsPage.module.scss'
import { CgProfile } from 'react-icons/cg'
import { useQuery } from '@apollo/client'
import 'react-toastify/dist/ReactToastify.css';
import { User } from '../../model/UserModel'
import { AiOutlineSearch } from 'react-icons/ai'
import { getCurrentUser } from '../component/MasterLayout'
import { GET_ALL_CHATROOM } from '../../query/ChatQuery';
import { ChatRoom } from '../../model/ChatModel';
import { timeSinceShort } from '../../helper/DateHelper';
import ChatRoomComponent from '../component/ChatRoomComponent';
import { useParams } from 'react-router-dom';


export default function ChatsPage() {

    const { paramChatRoomID } = useParams()
    const user = getCurrentUser()

    const [chatRoomID, setChatRoomID] = useState<string>(paramChatRoomID || '')
    console.log(chatRoomID);
    const [search, setSearch] = useState('');

    const { data: chatRoomData } = useQuery<{ getAllChatRoom: ChatRoom[] }>(GET_ALL_CHATROOM, {
        variables: {
            id: user?.id
        },
    })

    const [filteredChatRoom, setFilteredChatRoom] = useState<ChatRoom[]>([]);

    useEffect(() => {
        if (chatRoomData) {
            const filteredRooms = chatRoomData.getAllChatRoom.filter(room =>
                room.user.some(user =>
                    `${user.first_name} ${user.last_name}`.toLowerCase().includes(search.toLowerCase())
                ) ||
                room.chat.some(chat => chat.text.toLowerCase().includes(search.toLowerCase())))

            setFilteredChatRoom(filteredRooms);
        }
    }, [search, chatRoomData]);

    const toChatRoom = (chatRoomID: string) => {
        setChatRoomID(chatRoomID)
    }

    return (
        <div className={style['page-container']}>
            <div className={style['sidebar']}>
                <div className={style['sidebar-profile']}>
                    <div className={style['sidebar-profile-title']}>
                        <h2>Chats</h2>
                    </div>
                    <div className={style['sidebar-search']}>
                        <AiOutlineSearch id={style['search-icon']} />
                        <input type="text" placeholder='Search Messenger' value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <hr />
                    <div className={style['friend-profile-nav-container']}>
                        {filteredChatRoom.length ?
                            filteredChatRoom.map((data) => (
                                <ChatNavCard key={data.id} data={data} toChatRoom={toChatRoom} userData={user as User} />
                            ))
                            : <h4 style={{ color: 'gray', margin: 'auto' }}>No friends...</h4>
                        }
                    </div>
                </div>

            </div>
            <div className={style['page-content']} style={{ margin: '0' }}>
                {chatRoomID != ''
                    ?
                    <ChatRoomComponent chatRoomID={chatRoomID} />
                    :
                    <h3 style={{ color: 'gray', marginTop: '50vh', marginLeft: '60vw' }}>Select a profile</h3>
                }
            </div>

        </div>
    )

}

interface ChatNavCardProps {
    data: ChatRoom
    toChatRoom: (chatRoomID: string) => void
    userData: User
}

function ChatNavCard({ data, toChatRoom, userData }: ChatNavCardProps) {

    const otherUser = data.user.filter(user => user.id !== userData.id);
    const personal = otherUser[0]
    const lastChat = data.chat[data.chat.length - 1] || []

    return (
        <div className={style['card-body-profile']} onClick={() => toChatRoom(data.id)}>
            {data.group ?
                (data.group.bannerImageURL ?
                    <img src={data.group.bannerImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />)
                :
                ( personal.profileImageURL ? <img src={personal.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} /> )
            }
            <div>
                {data.group ? <h5>{data.group.name}</h5>
                    :
                    <h5>{personal.first_name + " " + personal.last_name}</h5>
                }
                {
                    lastChat.text ?
                        <h6>{lastChat.text} - {timeSinceShort(new Date(lastChat.createdAt))}</h6>
                        : <h6>Start a conversation</h6>
                }
            </div>
        </div>
    )
}
