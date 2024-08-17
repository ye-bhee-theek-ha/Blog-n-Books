import React, { useState, useMemo } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import EditorToolbar from './EditorToolbar';
import { renderElement, renderLeaf } from './EditorElements';
import { logSelectedText, toggleFormat } from './utils';
import PropTypes from 'prop-types'

const BlogEditor = (props) => {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const initialValue = useMemo(
    () =>
      JSON.parse(localStorage.getItem('content')) || [
        {
          type: 'paragraph',
          children: [{ text: 'A line of text in a paragraph.' }],
        },
      ],
    []
  )

  return (
    <div className={"p-4" + props.EditorClassname}>
      <Slate 
      editor={editor} 
      initialValue={initialValue}
      onChange={value => {
        const isAstChange = editor.operations.some(
          op => 'set_selection' !== op.type
        )
        if (isAstChange) {
          // Save the value to Local Storage.
          const content = JSON.stringify(value)
          localStorage.setItem('content', content)
        }
      }}
      >
        <EditorToolbar editor={editor} 
          WrapperClassname= "bg-lorange bg-opacity-75"
          BtnNotActive = "bg-red-50 shadow-md"
          BtnActive = "bg-red-50 ring-2 ring-mehroon"
        />
          <div className={props.edit}>
            <Editable
              className={" " + props.TxtAreaClassname}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={(event) => {
                if (!event.ctrlKey) return;

                switch (event.key) {
                  case 'b': {
                    event.preventDefault();
                    toggleFormat(editor, 'bold');
                    break;
                  }
                  case 'i': {
                    event.preventDefault();
                    toggleFormat(editor, 'italic');
                    break;
                  }
                  case 'u': {
                    event.preventDefault();
                    toggleFormat(editor, 'underline');
                    break;
                  }
                }
              }}
            />
          </div>
      </Slate>
    </div>
  );
};

BlogEditor.propTypes = {
  EditorClassname : PropTypes.string
}

BlogEditor.defaultProps = {
  EditorClassname : ""
}

export default BlogEditor;
