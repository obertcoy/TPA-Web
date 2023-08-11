import { useState, useEffect } from 'react'
import { getCurrentUser } from '../../component/MasterLayout'
import style from '../../css/CreateTextStoryPage.module.scss'
import { CgProfile } from 'react-icons/cg'
import { PiTextAaBold } from 'react-icons/pi'
import { useMutation } from '@apollo/client'
import { CREATE_STORY } from '../../../query/StoryQuery'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2canvas from 'html2canvas'
import { firebaseStorage } from '../../../provider/FirebaseProvider'
import { v4 } from 'uuid'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export default function CreateTextStoryPage() {

    const [text, setText] = useState('')
    const [font, setFont] = useState('font-first')
    const [background, setBackground] = useState('bg-first')
    const [fileURL, setFileURL] = useState('')

    const [createStory, { error }] = useMutation(CREATE_STORY)
    const navigate = useNavigate()

    const screenshotContent = () => {
        const content = document.querySelector(`.${style['preview-bg']} > div`) as HTMLElement;
        console.log(content);

        if (content) {
            html2canvas(content, { scale: 2 }).then((canvas) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        const fileRef = ref(firebaseStorage, `stories/${v4()}text`);
                        uploadBytes(fileRef, blob).then((snapshot) => {
                            getDownloadURL(snapshot.ref).then((url) => {
                                setFileURL(url);
                            })
                        })
                    }
                }, 'image/png');
            })
        }
    };

    const handleCreateStory = async () => {

        screenshotContent()
    }

    useEffect(() => {

        console.log(fileURL);

        if (fileURL != '') {

            const createStoryFunc = async () => {


                await createStory({
                    variables: {
                        inputStory: {
                            fileURL: fileURL
                        }
                    }
                })

                if (!error) {
                    toast.success('Story succefully created!')
                    setTimeout(() => {
                        navigate('/main/home');
                    }, 1500);
                }
            }
            createStoryFunc()
        }

    }, [fileURL])

    const handleDiscard = () => {
        navigate('/main/create-story/select')
    }

    const scaleValue = '1.1';
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
                    <div>
                        <textarea rows={10} value={text} placeholder='Start typing' onChange={(e) => setText(e.target.value)}></textarea>
                    </div>
                    <div className={style['sidebar-input-font']}>
                        <PiTextAaBold className={style['font-icon']} />
                        <select onChange={(e) => setFont(e.target.value)}>
                            <option value="font-first">Arial</option>
                            <option value="font-second">fantasy</option>
                            <option value="font-third">monospace</option>
                            <option value="font-fourth">Verdana</option>
                            <option value="font-fifth">Century Gothic</option>

                        </select>
                    </div>
                    <div className={style['sidebar-input-bg']}>
                        <h5>Backgrounds</h5 >
                        <div className={style['bg-container']}>
                            <div onClick={() => setBackground('bg-first')} style={background == 'bg-first' ? { scale: scaleValue, outline: "solid 3px #1877f2" } : { scale: '1' }}></div>
                            <div onClick={() => setBackground('bg-second')} style={background == 'bg-second' ? { scale: scaleValue, outline: "solid 3px #1877f2" } : { scale: '1' }}></div>
                            <div onClick={() => setBackground('bg-third')} style={background == 'bg-third' ? { scale: scaleValue, outline: "solid 3px #1877f2" } : { scale: '1' }}></div>
                            <div onClick={() => setBackground('bg-fourth')} style={background == 'bg-fourth' ? { scale: scaleValue, outline: "solid 3px #1877f2" } : { scale: '1' }}></div>
                            <div onClick={() => setBackground('bg-fifth')} style={background == 'bg-fifth' ? { scale: scaleValue, outline: "solid 3px #1877f2" } : { scale: '1' }}></div>
                        </div>
                    </div>
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
                        <div className={style[background]}>
                            {text == '' ? <h2>Start typing</h2>
                                :
                                <p className={style[font]}>{text}</p>
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