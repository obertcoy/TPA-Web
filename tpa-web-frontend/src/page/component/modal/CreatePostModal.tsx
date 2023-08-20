import style from './css/CreatePostModal.module.scss'
import { CgProfile } from 'react-icons/cg'
import { IoIosClose, IoMdPhotos } from 'react-icons/io'
import { AiFillTags, AiOutlineSearch } from 'react-icons/ai'
import { GrClose } from 'react-icons/gr'
import { useRef, useState } from 'react'
import 'firebase/storage'
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage'
import { firebaseStorage } from '../../../provider/FirebaseProvider'
import { v4 } from 'uuid'
import { getCurrentUser } from '../MasterLayout'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_POST } from '../../../query/PostQuery'
import { BiArrowBack } from 'react-icons/bi'
import { ShowUser, User } from '../../../model/UserModel'
import { UserName } from '../../../helper/UserHelper'
import { GET_USER } from '../../../query/UserQuery'
import EditorText from '../EditorText'
import { GET_ALL_USER_GROUP } from '../../../query/GroupQuery'
import { Group } from '../../../model/GroupModel'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'


interface CreatePostModalProps {
    handleOpenCreatePost: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetchGetAllPost: (variables?: Partial<any>) => Promise<any>;
    initialGroup: Group | null
}

export default function CreatePostModal({ handleOpenCreatePost, refetchGetAllPost, initialGroup }: CreatePostModalProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [postType, setPostType] = useState('public')
    const [filesURL, setFilesURL] = useState<string[]>([]);
    const savedFilesURL: string[] = []
    const [text, setText] = useState('')
    const [taggedUser, setTaggedUser] = useState<ShowUser[]>([])
    const [isTagOpen, setIsTagOpen] = useState(false)
    const [resetEditor, setResetEditor] = useState(false)
    const [group, setGroup] = useState(initialGroup?.id || '')

    const user = getCurrentUser()

    const [createPost, { error }] = useMutation(CREATE_POST)
    const { data: userData } = useQuery<{ getUser: User }>(GET_USER, {
        variables: {
            id: user?.id
        },
    })

    const { data: groupsData } = useQuery<{ getAllUserGroup: Group[] }>(GET_ALL_USER_GROUP)

    const handleOpenTag = () => {
        setIsTagOpen(!isTagOpen)
    }

    const handleAddTag = (user: ShowUser) => {

        if (!taggedUser.includes(user)) {
            setTaggedUser(prev => [...prev, user]);
        }
    }

    const handleRemoveTag = (user: ShowUser) => {
        setTaggedUser(prev => prev.filter(tagged => tagged != user))
    }

    const clearAllFilesInTemps = async () => {
        const listRef = ref(firebaseStorage, 'temps');
        const files = await listAll(listRef);
        const deletePromises = files.items.map(fileRef => deleteObject(fileRef));
        await Promise.all(deletePromises);
    }

    const moveFilesToUploads = async () => {
        for (const url of filesURL) {

            const urlObject = new URL(url);
            const pathname = urlObject.pathname;
            const decodedfilename = decodeURIComponent(pathname).split('/o/')[1].split('?')[0];
            const filename = decodedfilename.split('temps/')[1]
            const fileRef = ref(firebaseStorage, `uploads/${filename}`);
            const response = await fetch(url);
            const blob = await response.blob();
            const snapshot = await uploadBytes(fileRef, blob);
            const savedURL = await getDownloadURL(snapshot.ref);
            savedFilesURL.push(savedURL);
        }
    }


    const handleCloseModal = () => {
        clearAllFilesInTemps()
        handleOpenCreatePost()
    }

    const handleDeleteFile = (url: string) => {
        setFilesURL(prevURLs => prevURLs.filter(item => item !== url));
    };

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files) {
            const totalFiles = filesURL.length + files.length;

            if (totalFiles > 10) {
                alert('You can upload a maximum of 10 files. Please select fewer files.');
                return;
            }

            for (const file of Array.from(files)) {
                const fileRef = ref(firebaseStorage, `temps/${v4()}${file.name}`);

                toast.promise(
                    uploadBytes(fileRef, file),
                    {
                        pending: 'Uploading file...',
                        success: 'File uploaded!',
                        error: 'File upload failed',
                    }
                ).then(async (snapshot) => {

                    const url = await getDownloadURL(snapshot.ref);
                    setFilesURL((prev) => [...prev, url]);
                })
            }
        }
    };


    const handleCreatePost = async () => {
        if (text != '' && postType != '') {

            await toast.promise(moveFilesToUploads(), {
                pending: 'Uploading file...',
                success: 'File uploaded!',
                error: 'File upload failed',
            })

            if (taggedUser.length > 0) {

                const taggedID = taggedUser.map((user) => {
                    return user.id
                })

                await createPost({
                    variables: {
                        inputPost: {
                            text: text,
                            type: postType,
                            fileURL: savedFilesURL,
                            taggedID: taggedID,
                            groupID: group
                        }
                    }
                })

            } else {

                await createPost({
                    variables: {
                        inputPost: {
                            text: text,
                            type: postType,
                            fileURL: savedFilesURL,
                            taggedID: null,
                            groupID: group
                        }
                    }
                })
            }
            if (!error) {
                refetchGetAllPost()
                handleCloseModal()
            }
        }
    }

    console.log(text);


    return (
        <div className={style['page-container']}>
            {
                isTagOpen ?
                    <TagPeopleModal tagged={taggedUser} handleAddTag={handleAddTag} handleRemoveTag={handleRemoveTag} handleOpenTag={handleOpenTag} userData={userData?.getUser} />
                    :
                    <div className={style['form-container']}>
                        <div className={style['form-title']}>
                            <h4>Create Post</h4>
                            <GrClose className={style['close-icon']} onClick={handleCloseModal} />
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
                                            {taggedUser && taggedUser.length > 0 && (
                                                <>
                                                    <span style={{ fontWeight: '400' }}> is with </span>
                                                    {taggedUser.map((user, index) => (
                                                        <span key={user.id}>
                                                            {index > 0 && ", "}
                                                            {user.first_name} {user.last_name}
                                                        </span>
                                                    ))}
                                                </>
                                            )}
                                        </h5>
                                    </div>


                                    <select name="post-type" onChange={(e) => setPostType(e.target.value)} id="">
                                        <option value="public">Public</option>
                                        <option value="friends">Friends</option>
                                        <option value="specific">Specific Friends</option>
                                    </select>
                                </div>
                                <select name="group" onChange={(e) => setGroup(e.target.value)} style={{ marginRight: 'auto' }}>
                                    {group != '' ?
                                        <option value={group}>{initialGroup?.name}</option>
                                        :
                                        <>
                                            <option value="">No Group</option>
                                            {groupsData?.getAllUserGroup.map((data) => (
                                                <option value={data.id}>{data.name}</option>
                                            ))}
                                        </>
                                    }
                                </select>
                            </div>
                            <div className={style['form-content-text']}>
                                {/* <textarea placeholder="What's on your mind?" onChange={(e) => setText(e.target.value)} /> */}
                                <EditorText handleOnChange={setText} resetEditor={resetEditor} placeholder={"What's on your mind?"} initialValue={null} />
                            </div>
                            {filesURL.length > 0 &&
                                <div className={style['form-content-file']}>
                                    {filesURL.map((url) => {
                                        if (url.includes('.mp4')) {
                                            return (
                                                <div key={url} className={style['uploaded-file-container']}>
                                                    <video src={url} className={style['uploaded-file']} controls />
                                                    <GrClose className={style['delete-file-icon']} onClick={() => handleDeleteFile(url)} />
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div key={url} className={style['uploaded-file-container']}>
                                                    <img src={url} className={style['uploaded-file']} />
                                                    <GrClose className={style['delete-file-icon']} onClick={() => handleDeleteFile(url)} />
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            }

                            <div className={style['form-content-input']}>
                                <h5>Add to your post</h5>
                                <div>
                                    <IoMdPhotos className={style['post-icon']} style={{ color: "green", cursor: "pointer" }} onClick={handleIconClick} />
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} multiple />
                                    <AiFillTags className={style['post-icon']} style={{ color: "blue", cursor: "pointer" }} onClick={handleOpenTag} />
                                </div>
                            </div>
                            <button id={style['post-button']} onClick={handleCreatePost}>Post</button>
                        </div>
                    </div>
            }
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
    )
}

interface TagPeopleModalProps {
    tagged: ShowUser[]
    handleAddTag: (user: ShowUser) => void
    handleRemoveTag: (user: ShowUser) => void
    handleOpenTag: () => void
    userData: User | undefined
}

function TagPeopleModal({ tagged, handleAddTag, handleRemoveTag, handleOpenTag, userData }: TagPeopleModalProps) {

    const [searchFriend, setSearchFriend] = useState('');
    const filteredFriends = userData?.friend.filter(friend =>
        (friend.first_name + " " + friend.last_name).toLowerCase().includes(searchFriend.toLowerCase())
    ) || []

    return (
        <div className={style['tag-form-container']}>
            <div className={style['tag-form-title']}>
                <BiArrowBack id={style['back-icon']} onClick={handleOpenTag} />
                <h4>Tag People</h4>
            </div>
            <hr />
            <div className={style['tag-form-body']}>
                <div className={style['tag-search-container']}>
                    <div className={style['tag-search']}>
                        <AiOutlineSearch id={style['search-icon']} />
                        <input type="text" placeholder='Search Friends' value={searchFriend} onChange={(e) => setSearchFriend(e.target.value)} />
                    </div>
                    <h5 onClick={handleOpenTag}>Done</h5>
                </div>
                {tagged.length > 0
                    &&
                    <div className={style['tagged-container']}>
                        <h5>Tagged</h5>
                        <div className={style['tagged-user-container']}>
                            {tagged.map((user) => (
                                <div key={user.id} className={style['tagged-user']}>
                                    {UserName(user)}
                                    <IoIosClose className={style['remove-icon']} onClick={() => handleRemoveTag(user)} />
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
                                <div key={data.id} onClick={() => handleAddTag(data)}>
                                    {data.profileImageURL ? <img src={data.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                                    <h5>{UserName(data)}</h5>
                                </div>
                            ))
                            : <h5 style={{ color: "gray" }}>No friends...</h5>
                    }
                </div>
            </div>
        </div >
    )
}
