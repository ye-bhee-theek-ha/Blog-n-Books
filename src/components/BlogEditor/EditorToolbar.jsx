import React from 'react';
import { useSlate } from 'slate-react';
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconListCheck,
  IconListNumbers,
  IconLink,
  IconPhotoScan,
  IconX,
  IconH1,
  IconH2,
} from '@tabler/icons-react';
import {
  toggleFormat,
  isFormatActive,
  toggleBlock,
  isBlockActive,
  toggleList,
  toggleAlignment,
  isAlignmentActive,
  insertLink,
  insertImage,
  clearFormatting,
} from './utils';
import PropTypes from 'prop-types'

const EditorToolbar = (props) => {
  const editor = useSlate();

  return (
    <div className={"p-2 mb-2 rounded-md flex items-center " + props.WrapperClassname}>
      <button
        type="button"
        className={`px-2 py-1 rounded-md mr-2 ${
          isFormatActive(editor, 'bold')
            ? props.BtnActive
            : props.BtnNotActive
        }`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleFormat(editor, 'bold');
        }}
      >
        <IconBold className="w-5 h-5" strokeWidth={2} />
      </button>

      <button
        type="button"
        className={`px-2 py-1 rounded-md mr-2 ${
          isFormatActive(editor, 'italic')
            ? props.BtnActive
            : props.BtnNotActive
        }`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleFormat(editor, 'italic');
        }}
      >
        <IconItalic className="w-5 h-5" strokeWidth={2} />
      </button>

      <button
        type="button"
        className={`px-2 py-1 rounded-md mr-2 ${
          isFormatActive(editor, 'underline')
            ? props.BtnActive
            : props.BtnNotActive
        }`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleFormat(editor, 'underline');
        }}
      >
        <IconUnderline className="w-5 h-5" strokeWidth={2} />
      </button>

      <div className="border-l border-mehroon mx-2 h-6"></div>
      
      <button
        type="button"
        className={`px-2 py-1 rounded-md mr-2 ${
          isBlockActive(editor, 'heading-one')
            ? props.BtnActive
            : props.BtnNotActive
        }`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, 'heading-one');
        }}
      >
        <IconH1 className="w-5 h-5" strokeWidth={2} />
      </button>

      <button
        type="button"
        className={`px-2 py-1 rounded-md mr-2 ${
          isBlockActive(editor, 'heading-two')
            ? props.BtnActive
            : props.BtnNotActive  
        }`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, 'heading-two');
        }}
      >
        <IconH2 className="w-5 h-5" strokeWidth={2} />
      </button>

      <button
        type="button"
        className={`px-2 py-1 rounded-md mr-2 ${
          isBlockActive(editor, 'list-item')
            ? props.BtnActive
            : props.BtnNotActive
        }`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleList(editor, 'numbered-list');
        }}
      >
        <IconListNumbers className="w-5 h-5" strokeWidth={2} />
      </button>

      <button
        type="button"
        className={`px-2 py-1 rounded-md mr-2 ${
          isBlockActive(editor, 'list-item')
            ? props.BtnActive
            : props.BtnNotActive
        }`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, 'bulleted-list');
        }}
      >
        <IconListCheck className="w-5 h-5" strokeWidth={2} />
      </button>

      <div className="border-l border-mehroon mx-2 h-6"></div>

      <button
        type="button"
        className={`px-2 py-1 rounded-md mr-2 ${
          isAlignmentActive(editor, 'left')
            ? props.BtnActive
            : props.BtnNotActive
        }`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleAlignment(editor, 'left');
        }}
      >
        <IconAlignLeft className="w-5 h-5" strokeWidth={2} />
      </button>

      <button
        type="button"
        className={`px-2 py-1 rounded-md mr-2 ${
          isAlignmentActive(editor, 'center')
            ? props.BtnActive
            : props.BtnNotActive
        }`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleAlignment(editor, 'center');
        }}
      >
        <IconAlignCenter className="w-5 h-5" strokeWidth={2} />
      </button>

      <button
        type="button"
        className={`px-2 py-1 rounded-md mr-2 ${
          isAlignmentActive(editor, 'right')
            ? props.BtnActive
            : props.BtnNotActive
        }`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleAlignment(editor, 'right');
        }}
      >
        <IconAlignRight className="w-5 h-5" strokeWidth={2} />
      </button>

      <button
        type="button"
        className={`px-2 py-1 rounded-md ${
          isAlignmentActive(editor, 'justify')
            ? props.BtnActive
            : props.BtnNotActive
        }`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleAlignment(editor, 'justify');
        }}
      >
        <IconAlignJustified className="w-5 h-5" strokeWidth={2} />
      </button>

      <div className="border-l border-mehroon mx-2 h-6"></div>

      <button
        type="button"
        className={"px-2 py-1 rounded-md mr-2 " + props.BtnNotActive}
        onClick={() => insertLink(editor)}
      >
        <IconLink className="w-5 h-5" strokeWidth={2} />
      </button>

      <button
        type="button"
        className={"px-2 py-1 rounded-md mr-2 " + props.BtnNotActive}
        onClick={() => insertImage(editor)}
      >
        <IconPhotoScan className="w-5 h-5" strokeWidth={2} />
      </button>

      <div className="border-l border-mehroon mx-2 h-6"></div>

      <button
        type="button"
        className={"px-2 py-1 rounded-md mr-2 " + props.BtnNotActive}
        onClick={() => clearFormatting(editor)}
      >
        <IconX className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  );
};

EditorToolbar.propTypes = {
  WrapperClassname: PropTypes.string,
  BtnActive: PropTypes.string,
  BtnNotActive: PropTypes.string
}

EditorToolbar.defaultProps = {
  WrapperClassname: "",
  BtnActive: "",
  BtnNotActive: ""
}

export default EditorToolbar;
