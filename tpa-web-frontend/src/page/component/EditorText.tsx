import React, { useState, useEffect } from 'react';
import { ContentState, Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import style from './css/EditorText.module.scss'
import { useQuery } from '@apollo/client';
import { GET_ALL_USER } from '../../query/UserQuery';
import { User } from '../../model/UserModel';
import { Post } from '../../model/PostModel';
import { GET_ALL_POST_DEBUG } from '../../query/PostQuery';

interface EditorTextProps {
    handleOnChange: (value: string) => void;
    placeholder: string
    resetEditor: boolean
    initialValue: ContentState | null
}

export default function EditorText({ handleOnChange, placeholder, resetEditor, initialValue }: EditorTextProps) {

    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    useEffect(() => {
        if (resetEditor) {
            setEditorState(EditorState.createEmpty());
        }
    }, [resetEditor]);

    useEffect(() => {
        if (initialValue == null || initialValue == undefined) {
            return;
        }

        // setEditorState(EditorState.createWithContent(initialValue));
    }, [initialValue]);


    const handleEditorStateChange = (newEditorState: EditorState) => {
        setEditorState(newEditorState);
        handleOnChange(draftToHtml(convertToRaw(newEditorState.getCurrentContent())));
    };

    const { data: allUserData } = useQuery<{ getAllUser: User[] }>(GET_ALL_USER)
    const { data: allPostData } = useQuery<{ getAllPostDebug: Post[] }>(GET_ALL_POST_DEBUG)

    const formattedUsers = allUserData?.getAllUser.map(user => ({
        ...user,
        text: `${user.first_name} ${user.last_name}`,
        value: `${user.first_name} ${user.last_name}`,
        url: `/main/profile/${user.id}`,
    }));

    const mentionSuggestions = formattedUsers || []

    return (
        <Editor
            placeholder={placeholder}
            toolbarHidden
            editorState={editorState}
            onEditorStateChange={handleEditorStateChange}
            wrapperClassName={style['wrapper']}
            editorClassName="demo-editor"
            mention={{
                separator: ' ',
                trigger: '@',
                suggestions: mentionSuggestions,
            }}

        />
    );
}
