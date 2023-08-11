import style from './css/CreatePostModal.module.scss'
import { CgProfile } from 'react-icons/cg'
import { IoMdPhotos } from 'react-icons/io'
import { AiFillTags } from 'react-icons/ai'
import { GrClose } from 'react-icons/gr'
import { useRef, useState } from 'react'
import 'firebase/storage'
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage'
import { firebaseStorage } from '../../../provider/FirebaseProvider'
import { v4 } from 'uuid'
import { getCurrentUser } from '../MasterLayout'
import { useMutation } from '@apollo/client'
import { CREATE_POST } from '../../../query/PostQuery'

interface CreatePostModalProps {
    handleOpenCreatePost: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetchGetAllPost: (variables?: Partial<any>) => Promise<any>;
}

export default function CreatePostModal({ handleOpenCreatePost, refetchGetAllPost }: CreatePostModalProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [postType, setPostType] = useState('public')
    const [filesURL, setFilesURL] = useState<string[]>([]);
    const savedFilesURL: string[] = []
    const [text, setText] = useState('')
    const [createPost, { error }] = useMutation(CREATE_POST)


    const clearAllFilesInTemps = async () => {
        const listRef = ref(firebaseStorage, 'temps');
        const files = await listAll(listRef);
        const deletePromises = files.items.map(fileRef => deleteObject(fileRef));
        await Promise.all(deletePromises);
    };

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
                const snapshot = await uploadBytes(fileRef, file);
                const url = await getDownloadURL(snapshot.ref);
                setFilesURL((prev) => [...prev, url]);
            }
        }
    };


    const handleCreatePost = async () => {
        if (text != '' && postType != '') {

            await moveFilesToUploads()

            await createPost({
                variables: {
                    inputPost: {
                        text: text,
                        type: postType,
                        fileURL: savedFilesURL,
                        taggedID: null
                    }
                }
            })
            if (!error) {
                refetchGetAllPost()
                handleCloseModal()
            }
        }
    }

    const user = getCurrentUser()

    return (
        <div className={style['page-container']}>
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
                            <img src={user?.profileImageURL} alt="" />
                        }
                        <div>
                            <h5>{user?.first_name + " " + user?.last_name}</h5>
                            <select name="post-type" onChange={(e) => setPostType(e.target.value)} id="">
                                <option value="public">Public</option>
                                <option value="friends">Friends</option>
                                <option value="specific">Specific Friends</option>
                            </select>
                        </div>
                    </div>
                    <div className={style['form-content-text']}>
                        <textarea placeholder="What's on your mind?" onChange={(e) => setText(e.target.value)} />
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
                            <AiFillTags className={style['post-icon']} style={{ color: "blue", cursor: "pointer" }} />
                        </div>
                    </div>
                    <button id={style['post-button']} onClick={handleCreatePost}>Post</button>
                </div>
            </div>
        </div>
    )
}