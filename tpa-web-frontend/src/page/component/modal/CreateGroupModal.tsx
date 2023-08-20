import { GrClose } from 'react-icons/gr'
import style from './css/CreateGroupModal.module.scss'
import { CgProfile } from 'react-icons/cg'
import { getCurrentUser } from '../MasterLayout'
import { useMutation } from '@apollo/client'
import { CREATE_GROUP } from '../../../query/GroupQuery'
import { useState } from 'react'

interface CreateGroupModalProps {
    handleOpenModal: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetchGroup: (variables?: Partial<any>) => Promise<any>;
}

export function CreateGroupModal({ handleOpenModal, refetchGroup }: CreateGroupModalProps) {

    const user = getCurrentUser()

    const [name, setName] = useState('')
    const [groupType, setGroupType] = useState('public')
    const [createGroup] = useMutation(CREATE_GROUP)

    const handleCreateGroup = async () => {

        if (name != '' && groupType != '') {

            const isPrivate = groupType == 'private'

            await createGroup({
                variables: {
                    inputGroup: {
                        name: name,
                        private: isPrivate
                    }
                }
            })

            refetchGroup()
            handleOpenModal()
        }
    }

    return (
        <div className={style['page-container']}>

            <div className={style['form-container']}>
                <div className={style['form-title']}>
                    <h4>Create Group</h4>
                    <GrClose className={style['close-icon']} onClick={handleOpenModal} />
                </div>
                <hr />
                <div className={style['form-body']}>
                    <div className={style['form-body-profile']}>
                        {user?.profileImageURL == null ?
                            <CgProfile className={style['profile-icon']} />
                            :
                            <img src={user?.profileImageURL} alt="" className={style['profile-icon']} />
                        }
                        <div className={style['profile-detail-container']}>
                            <div className={style['profile-name-container']}>
                                <h5>
                                    {user?.first_name} {user?.last_name}
                                </h5>
                            </div>
                            <select name="group-type" onChange={(e) => setGroupType(e.target.value)} id="">
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                    </div>
                    <div className={style['form-content-input']}>
                        <textarea placeholder="Name your group" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <button id={style['post-button']} onClick={handleCreateGroup}>Create</button>
                </div>
            </div>

        </div>
    )
}