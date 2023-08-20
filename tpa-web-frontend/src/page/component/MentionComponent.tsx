import { useQuery } from '@apollo/client';
import { GET_ALL_USER } from '../../query/UserQuery';
import { MentionsInput, Mention } from 'react-mentions';
import { User } from '../../model/UserModel';
import { GET_ALL_POST_DEBUG } from '../../query/PostQuery.js';
import { Post } from '../../model/PostModel.js';

interface MentionInputComponentProps {

    value: string
    handleInputChange: (value: string) => void
}

export const MentionInputComponent = ({ value, handleInputChange }: MentionInputComponentProps) => {

    const { data: allUserData } = useQuery<{ getAllUser: User[] }>(GET_ALL_USER)
    const { data: allPostData } = useQuery<{ getAllPostDebug: Post[] }>(GET_ALL_POST_DEBUG)

    const formattedUsers = allUserData?.getAllUser.map(user => ({
        ...user,
        display: `${user.first_name} ${user.last_name}`,
    }));

    const formattedPosts = allPostData?.getAllPostDebug.map(post => ({
        ...post,
        display: `${post.text}`,
    }));

    console.log(value);

    return (

        <div className={style['mention-input-container']}>
            <MentionsInput value={value}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="What's on your mind?"
                style={mentionInputStyle}
            >
                <Mention
                    trigger="@"
                    data={formattedUsers || []}
                    className={style['mention-text']}
                    displayTransform={(id, display) => `@${display}`}
                    markup='@[__display__](__id__)'
                />
                <Mention
                    trigger="#"
                    data={formattedPosts || []}
                    className={style['mention-text']}
                    displayTransform={(id, display) => `#${display}`}
                    markup='#[__display__](__id__)'
                />
            </MentionsInput>
        </div>
    )

}


export const MentionSingleInputComponent = ({ value, handleInputChange }: MentionInputComponentProps) => {

    const { data: allUserData } = useQuery<{ getAllUser: User[] }>(GET_ALL_USER)
    const { data: allPostData } = useQuery<{ getAllPostDebug: Post[] }>(GET_ALL_POST_DEBUG)

    const formattedUsers = allUserData?.getAllUser.map(user => ({
        ...user,
        display: `${user.first_name} ${user.last_name}`,
    }));

    const formattedPosts = allPostData?.getAllPostDebug.map(post => ({
        ...post,
        display: `${post.text}`,
    }));


    return (

        <div className={style['mention-input-container']}>
            <MentionsInput value={value}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="What's on your mind?"
                style={mentionInputStyle}
                singleLine={true}
                className={style['mention-input']}
            >
                <Mention
                    trigger="@"
                    data={formattedUsers || []}
                    className={style['mention-text']}
                    displayTransform={(id, display) => `@${display}`}
                    markup='@[__display__](__id__)'
                />
                <Mention
                    trigger="#"
                    data={formattedPosts || []}
                    className={style['mention-text']}
                    displayTransform={(id, display) => `#${display}`}
                    markup='#[__display__](__id__)'
                />
            </MentionsInput>
        </div>
    )

}

