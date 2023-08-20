import { useState } from 'react'
import style from '../css/GroupsPage.module.scss'
import { CgProfile } from 'react-icons/cg'
import { useQuery } from '@apollo/client'
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineSearch } from 'react-icons/ai'
import { getCurrentUser } from '../component/MasterLayout'
import { GET_ALL_USER_GROUP } from '../../query/GroupQuery'
import { Group } from '../../model/GroupModel'
import GroupProfile from '../component/GroupProfile'
import { BsPlus } from 'react-icons/bs'
import { CreateGroupModal } from '../component/modal/CreateGroupModal';


export default function GroupsPage() {


    const user = getCurrentUser()

    const [selectedGroupID, setselectedGroupID] = useState('')
    const [searchGroup, setSearchGroup] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { data: groupData, refetch: refetchGroup } = useQuery<{ getAllUserGroup: Group[] }>(GET_ALL_USER_GROUP, {
        variables: {
            id: user?.id
        },
    })

    const handleOpenModal = () => {
        setIsModalOpen(!isModalOpen)
    }


    const toGroupProfile = (groupID: string) => {
        setselectedGroupID(groupID)
    }

    const filteredGroups = groupData?.getAllUserGroup.filter(group =>
        (group.name).toLowerCase().includes(searchGroup.toLowerCase())
    ) || []

    return (
        <div className={style['page-container']}>
            {isModalOpen ? <CreateGroupModal handleOpenModal={handleOpenModal} refetchGroup={refetchGroup}/> : null}
            <div className={style['sidebar']}>
                <div className={style['sidebar-profile']}>
                    <div className={style['sidebar-profile-title']}>
                        <div>
                            <h2>Groups</h2>
                        </div>
                    </div>
                    <div className={style['sidebar-search']}>
                        <AiOutlineSearch id={style['search-icon']} />
                        <input type="text" placeholder='Search Groups' value={searchGroup} onChange={(e) => setSearchGroup(e.target.value)} />
                    </div>
                    <button className={style['create-btn']} onClick={handleOpenModal}><BsPlus/>Create New Group</button>
                    <hr />
                    <div className={style['group-profile-nav-container']}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                            <h4>Groups you've joined</h4>
                            <h4><a href="">See all</a></h4>
                        </div>
                        {filteredGroups.length ?
                            filteredGroups.map((data) => (
                                <GroupProfileNavCard key={data.id} data={data} toGroupProfile={toGroupProfile} />
                            ))
                            : <h4 style={{ color: 'gray', margin: 'auto' }}>No group...</h4>
                        }
                    </div>
                </div>

            </div>
            <div className={style['page-content']} style={{ margin: '0' }}>
                {selectedGroupID != ''
                    ?
                    <GroupProfile groupID={selectedGroupID} />
                    :
                    <h3 style={{ color: 'gray', marginTop: '50vh', marginLeft: '60vw' }}>Select a profile</h3>
                }
            </div>

        </div>
    )

}

interface GroupProfileNavCardProps {
    data: Group
    toGroupProfile: (groupdID: string) => void
}

function GroupProfileNavCard({ data, toGroupProfile }: GroupProfileNavCardProps) {

    return (
        <div className={style['card-body-profile']} onClick={() => toGroupProfile(data.id)}>
            {data.bannerImageURL ? <img src={data.bannerImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
            <h5>{data.name}</h5>
        </div>
    )
}


