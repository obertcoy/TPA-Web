import { useRef, useState } from 'react'
import { getCurrentUser } from '../../component/MasterLayout'
import style from '../../css/CreatePhotoStoryPage.module.scss'
import { CgProfile } from 'react-icons/cg'
import { useMutation } from '@apollo/client'
import { CREATE_STORY } from '../../../query/StoryQuery'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage'
import { firebaseStorage } from '../../../provider/FirebaseProvider'
import { v4 } from 'uuid'
import { IoMdPhotos } from 'react-icons/io'

export default function CreatePhotoStoryPage() {

    const [fileURL, setFileURL] = useState('')

    let savedFileURL: string = ''
    const fileInputRef = useRef<HTMLInputElement>(null);

    const clearAllFilesInTemps = async () => {
        const listRef = ref(firebaseStorage, 'temps');
        const files = await listAll(listRef);
        const deletePromises = files.items.map(fileRef => deleteObject(fileRef));
        await Promise.all(deletePromises);
    };

    const uploadFile = async () => {

        const urlObject = new URL(fileURL);
        const pathname = urlObject.pathname;
        const decodedfilename = decodeURIComponent(pathname).split('/o/')[1].split('?')[0];
        const filename = decodedfilename.split('temps/')[1]
        const fileRef = ref(firebaseStorage, `stories/${filename}`);
        const response = await fetch(fileURL);
        const blob = await response.blob();
        const snapshot = await uploadBytes(fileRef, blob);
        const savedURL = await getDownloadURL(snapshot.ref);
        savedFileURL = savedURL;
        console.log(savedURL);
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files) {

            const file = files[0]
            const fileRef = ref(firebaseStorage, `temps/${v4()}${file.name}`);

            console.log('test');

            toast.promise(
                uploadBytes(fileRef, file),
                {
                    pending: 'Uploading file...',
                    success: 'File uploaded successfully!',
                    error: 'File upload failed',
                }
            ).then(async (snapshot) => {

                const url = await getDownloadURL(snapshot.ref);
                setFileURL(url);
            })

        }
    };

    const handleIconClick = () => {
        fileInputRef.current?.click()
    }


    const [createStory, { error }] = useMutation(CREATE_STORY)
    const navigate = useNavigate()

    const handleCreateStory = async () => {

        if (fileURL != '') {


            await toast.promise(
                uploadFile(),
                {
                    pending: 'Publishing...',
                    success: 'Story successfully published!',
                    error: 'Publishing failed',
                }
            );
            await createStory({
                variables: {
                    inputStory: {
                        fileURL: savedFileURL
                    }
                }
            })

            if (!error) {
                toast.success('Story succefully created!')
                setTimeout(() => {
                    navigate('/main/home');
                }, 1500);
            } else {
                toast.error('Error creating story')
            }
        } else {
            toast.error('Error creating story')
        }
    }

    const handleDiscard = async () => {

        await clearAllFilesInTemps
        navigate('/main/create-story/select')
    }

    const user = getCurrentUser()

    return (
        <div className={style['page-container']}>
            <div className={style['sidebar']}>
                <div className={style['sidebar-profile']}>
                    <h3>Your Story</h3>
                    <div>
                        {user?.profileImageURL ? <img src={user?.profileImageURL} alt="" className={style['profile-icon']} /> : <CgProfile className={style['profile-icon']} />}
                        <h4>{user?.first_name + " " + user?.last_name}</h4>
                    </div>
                </div>
                <hr />
                <div className={style['sidebar-input']}>

                    <IoMdPhotos className={style['photo-icon']} style={{ color: "green", cursor: "pointer" }} onClick={handleIconClick} />
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                    <h5 >Select a photo</h5>
                </div>
                <div className={style['sidebar-button']}>
                    <div className={style['button-container']}>
                        <button id={style['discard-btn']} onClick={handleDiscard}>Discard</button>
                        <button id={style['share-btn']} onClick={handleCreateStory}>Share to Story</button>
                    </div>
                </div>
            </div>
            <div className={style['page-content']}>
                <div className={style['preview-container']}>
                    <h5>Preview</h5>
                    <div className={style['preview-bg']}>
                        <div>
                            {fileURL == '' ? <h2>Select a photo</h2>
                                : <img src={fileURL} alt="uploaded photo" />
                            }
                        </div>
                    </div>
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
    )

}