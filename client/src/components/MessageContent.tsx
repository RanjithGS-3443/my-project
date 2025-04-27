import React from 'react';
import CodeBlock from './CodeBlock';

interface MessageContentProps {
  content: string;
}

const MessageContent: React.FC<MessageContentProps> = ({ content }) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: { type: 'text' | 'code'; content: string; language?: string }[] = [];
  
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      });
    }

    // Add code block
    parts.push({
      type: 'code',
      language: match[1] || 'plaintext',
      content: match[2].trim()
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex)
    });
  }

  return (
    <div className="space-y-4">
      {parts.map((part, index) => (
        <div key={index}>
          {part.type === 'text' ? (
            <div className="whitespace-pre-wrap">{part.content}</div>
          ) : (
            <CodeBlock code={part.content} language={part.language || 'plaintext'} />
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageContent;
