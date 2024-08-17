import { Editor, Transforms, Element as SlateElement } from 'slate';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

export const logSelectedText = (editor) => {
  const { selection } = editor;
  if (selection) {
    const selectedText = Editor.string(editor, selection);
    console.log('Selected text:', selectedText);
  }
};

export const toggleFormat = (editor, format) => {
  const isActive = isFormatActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isFormatActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);
    const isAlign = TEXT_ALIGN_TYPES.includes(format);
  
    Transforms.unwrapNodes(editor, {
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPES.includes(n.type),
      split: true,
    });
    let newProperties;
    if (isAlign) {
      newProperties = {
        align: isActive ? undefined : format,
      };
    } else {
      newProperties = {
        type: isActive
          ? 'paragraph'
          : isList
          ? 'list-item'
          : format,
      };
    }
    Transforms.setNodes(editor, newProperties);
  
    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };
  

  export const isBlockActive = (editor, format, blockType = 'type') => {
    const { selection } = editor;
    if (!selection) return false;
  
    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          (n[blockType] === format || n.align === format),
      })
    );
  
    return !!match;
  };
  

export const toggleList = (editor) => {
  const isActive = isBlockActive(editor, 'list-item');
  const isList = LIST_TYPES.includes('list-item');

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(
    editor,
    { type: isActive ? 'paragraph' : 'list-item' },
    { match: n => SlateElement.isElement(n) && n.type === 'paragraph' }
  );

  if (!isActive) {
    Transforms.wrapNodes(editor, { type: 'bulleted-list', children: [] });
  }
};

export const toggleAlignment = (editor, align) => {
  const isActive = isAlignmentActive(editor, align);

  const newProperties = {
    align: isActive ? undefined : align,
  };
  Transforms.setNodes(editor, newProperties);
};

export const isAlignmentActive = (editor, align) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.align === align,
  });

  return !!match;
};

export const insertLink = (editor) => {
  const url = window.prompt('Enter the URL of the link:');
  if (!url) return;

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  if (isCollapsed) {
    Transforms.insertNodes(editor, {
      type: 'link',
      url,
      children: [{ text: url }],
    });
  } else {
    Transforms.wrapNodes(
      editor,
      {
        type: 'link',
        url,
        children: [],
      },
      { split: true }
    );
    Transforms.collapse(editor, { edge: 'end' });
  }
};

export const insertImage = (editor) => {
  const url = window.prompt('Enter the URL of the image:');
  if (!url) return;

  Transforms.insertNodes(editor, {
    type: 'image',
    url,
    children: [{ text: '' }],
  });
};

export const clearFormatting = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: n => Editor.isInline(editor, n),
    split: true,
  });

  const marks = Editor.marks(editor);
  if (marks) {
    Object.keys(marks).forEach(mark => {
      Editor.removeMark(editor, mark);
    });
  }
};
