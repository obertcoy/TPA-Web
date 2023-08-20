import { useRef, useState, useEffect } from 'react'
import style from '../../css/CreateReelPage.module.scss'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage'
import { firebaseStorage } from '../../../provider/FirebaseProvider'
import { v4 } from 'uuid'
import { LiaFileVideoSolid } from 'react-icons/lia'
import { CREATE_REEL } from '../../../query/ReelQuery'

export default function CreateReelPage() {

    const [fileURL, setFileURL] = useState('')
    const [text, setText] = useState('')
    const [step, setStep] = useState(0);
    const [first, setFirst] = useState(false)

    useEffect(() => {
        if (text != '') {
            setStep(3)
        } else if (text == '' && first) {
            setStep(2)
        }
        setFirst(true)
    }, [text])

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
        const fileRef = ref(firebaseStorage, `reels/${filename}`);
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
                if (step == 0) {
                    setStep(1)
                }
            })
        }
    };

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };


    const [createReel] = useMutation(CREATE_REEL)
    const navigate = useNavigate()

    console.log(step);


    const handleCreateStory = async () => {

        if (step < 3) {
            if (step == 0 && fileURL == '') {
                toast.error('Select a video')
                return
            } else if (step == 2 && text == '') {
                toast.error('Fill in the details')
                return
            }
            setStep(step + 1)
            return
        }

        if (fileURL != '' || text != '') {

            await toast.promise(
                uploadFile(),
                {
                    pending: 'Publishing...',
                    success: 'Reel successfully published!',
                    error: 'Publishing failed',
                }
            );
            await createReel({
                variables: {
                    inputReel: {
                        text: text,
                        fileURL: savedFileURL
                    }
                }
            })

            setTimeout(() => {
                navigate('/main/home');
            }, 1500);

        } else {
            toast.error('Error creating reel')
        }
    }

    const handleDiscard = async () => {

        if (step > 1) {
            setStep(step - 1)
            return
        }

        await clearAllFilesInTemps
        navigate('/main/home')
    }

    return (
        <div className={style['page-container']}>
            <div className={style['sidebar']}>
                <div className={style['sidebar-profile']}>
                    <h6>Create a reel</h6>
                    {
                        step < 2 ?
                            <h2>Upload Video</h2>
                            :
                            <h2>Add Details</h2>

                    }
                </div>
                <hr />
                <div className={style['sidebar-input']}>

                    {step < 2 &&
                        <div onClick={handleIconClick} >
                            <LiaFileVideoSolid className={style['reel-icon']} style={{ color: "green", cursor: "pointer" }} />
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="video/*" />
                            {fileURL == '' ? <h5>Select a video</h5> : <h5>Replace video</h5>}
                        </div>
                    }
                    {step >= 2 &&
                        <textarea rows={10} value={text} placeholder='Start typing' onChange={(e) => setText(e.target.value)}></textarea>
                    }
                </div>
                <div className={style['sidebar-button']}>
                    <div className={style['bar-container']}>
                        <div className={step >= 1 ? style['bar-active'] : style['bar']}></div>
                        <div className={step >= 2 ? style['bar-active'] : style['bar']}></div>
                        <div className={step == 3 ? style['bar-active'] : style['bar']}></div>
                    </div>
                    <div className={style['button-container']}>
                        <button id={style['discard-btn']} onClick={handleDiscard}>{step > 1 ? 'Previous' : 'Discard'}</button>
                        <button id={style['share-btn']} onClick={handleCreateStory}>{step < 3 ? 'Next' : 'Publish'}</button>
                    </div>
                </div>
            </div>
            <div className={style['page-content']}>
                <div className={style['preview-container']}>
                    <h5>Preview</h5>
                    <div className={style['preview-bg']}>
                        <div>
                            {fileURL == '' ? <h2>Select a video</h2>
                                : <video src={fileURL} controls />
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