import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

type Props = {
  children: string
};

const Markdown = (props: Props) => {
  return (
    <ReactMarkdown
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');

          return !inline ? (
            <CodeBlock
              language={(match && match[1]) || ''}
              content={String(children).replace(/\n$/, '')}
            />
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        }
      }}
    >
      {props.children}
    </ReactMarkdown>
  );
};

export default Markdown;