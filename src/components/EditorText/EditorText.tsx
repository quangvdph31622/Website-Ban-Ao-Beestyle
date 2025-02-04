"use client"
import {useEditor, EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {memo} from "react";

const EditorText = () => {
    const editor = useEditor({
        extensions: [StarterKit],
    })

    return (
        <div>
            <EditorContent editor={editor}/>
        </div>
    );
}

export default memo(EditorText);
