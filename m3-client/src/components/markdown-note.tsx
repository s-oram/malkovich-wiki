import React from 'react';
import showdown from 'showdown';
import { SafeHtml } from './safe-html';
import MarkdownUtils from '../utils/markdown-utils';

interface Props {
  text: string;
  isEditing?: boolean;
  onChange?: (text: string) => void;
}

export const MarkDownNote = (props: Props) => {

  const converter = new showdown.Converter();
  const text1 = MarkdownUtils.convertWikiLinks(props.text);
  const html = converter.makeHtml(text1);

  return (
    <div className="MarkDownNote flex h-100">
      { props.isEditing
        ? <Editor defaultValue={props.text} onChange={props.onChange}></Editor>
        : <SafeHtml html={html}></SafeHtml>
      }
    </div>
  )
}


interface EditorProps {
  defaultValue: string;
  onChange?: (text: string) => void;
}

const Editor = (props: EditorProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };

  return (
    <textarea
      className="flex-grow-1"
      style={{ resize: 'none' }}
      defaultValue={props.defaultValue}
      onChange={handleChange}
    ></textarea>
  )
}

