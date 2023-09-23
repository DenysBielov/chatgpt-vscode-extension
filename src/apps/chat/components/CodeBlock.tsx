import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { BiCheck, BiCopy, BiInfoCircle, BiRefresh } from 'react-icons/bi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { VsCodeApi } from '../../../utils/vscode';
import { Tooltip } from 'react-tooltip';
import { v4 } from 'uuid';
import 'react-tooltip/dist/react-tooltip.css';

type Props = {
  language: string
  content: string
};

declare const vscode: VsCodeApi;

const CodeBlock: FC<Props> = ({ language, content }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleCopyClick = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }

    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  const handleReplaceClick = () => {
    vscode.postMessage({ command: "replaceCode", code: content });
  };

  const handleDragStart = (e: React.DragEvent<HTMLElement>) => {
    e.dataTransfer.setData('text/plain', content);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setIsMouseOver(true);
    if (e.ctrlKey) {
      setIsDraggable(true);
    }
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
    setIsDraggable(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && isMouseOver) {
        setIsDraggable(true);
      }
    };

    const handleKeyUp = () => {
      setIsDraggable(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isMouseOver]);

  const copyCodeButtonId = "copy-code-button-" + v4();

  return (
    <div className='code-block'>
      <div className='header'>
        <span className='language'>
          {language}
        </span>
        <div className='buttons'>
          <button className="insert-code-button" onClick={handleReplaceClick}><BiRefresh /></button>
          <button id={copyCodeButtonId} className="" onClick={handleCopyClick}>
            {
              isCopied ?
                <BiCheck color='green' /> :
                <BiCopy />
            }
          </button>
        </div>
      </div>
      <div
        className={`block-content${isDraggable ? " draggable" : ""}`}
        draggable={isDraggable}
        onDragStart={handleDragStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          customStyle={{ margin: 0 }}
        >
          {content}
        </SyntaxHighlighter>
        <span className='code-block-info-tooltip'>
          <BiInfoCircle />
        </span>
      </div>

      <Tooltip anchorSelect={"#" + copyCodeButtonId} place='top'>
        {isCopied ? "Copied!" : "Copy"}
      </Tooltip>
    </div>
  );
};

export default CodeBlock;