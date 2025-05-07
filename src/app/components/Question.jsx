// components/Question.tsx
import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Make sure to import the Katex CSS for styling

const Question = ({ question }) => {
  const renderContent = (content) => {
    if (content.includes('\\begin{') || content.includes('\\end{')) {
      // Handle LaTeX rendering using KaTeX
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(content, {
              throwOnError: false,
            }),
          }}
        />
      );
    } else if (content.startsWith('http')) {
      // Handle image rendering
      return <img src={content} alt="Question content" style={{ width: '100px', height: 'auto' }} />;
    } else {
      // Fallback for regular text content
      return <div>{content}</div>;
    }
  };

  return (
    <div>
      {/* Render question */}
      <div>
        {question.question.map((content, index) => (
          <div key={index}>{renderContent(content.content)}</div>
        ))}
      </div>

      {/* Render options */}
      <div>
        <h3>Options:</h3>
        {question.options.map((optionSet, index) => (
          <div key={index}>
            {optionSet.map((option, subIndex) => (
              <div key={subIndex}>{renderContent(option.content)}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Render correct solution */}
      <div>
        <h3>Solution:</h3>
        {question.correct_solution.map((solution, index) => (
          <div key={index}>{renderContent(solution.content)}</div>
        ))}
      </div>
    </div>
  );
};

export default Question;
