'use client';
import React from 'react';
import Question from '../../components/Question';

const questionData = [
  {
    "question_id": 647301,
    "question": [
      {
        "type": "image",
        "content": "https://plus.unsplash.com/premium_photo-1664299631876-f143dc691c4d?q=80&w=1897&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        "type": "text",
        "content": "\\begin{aligned} &\\text{If one zero of the quadratic polynomial } 3x^2 + px + 4 \\text{ is } \\frac{2}{3},\\ &\\text{which of the following is the value of } p \\text{ and the other zero of the polynomial?} \\end{aligned}"
      },
      {
        "type": "image",
        "content": "https://thenamesfactory.com/wp-content/uploads/2024/02/345-Funny-Monkey-Names.jpg"
      }
    ],
    "options": [
      [
        {
          "type": "text",
          "content": "\\begin{aligned} &\\quad p = 8, \\quad \\text{other zero is } -2 \\end{aligned}"
        }
      ],
      [
        {
          "type": "text",
          "content": "\\begin{aligned} &\\quad p = -8, \\quad \\text{other zero is } -2 \\end{aligned}"
        }
      ],
      [
        {
          "type": "text",
          "content": "\\begin{aligned} &\\quad p = 8, \\quad \\text{other zero is } 2 \\end{aligned}"
        }
      ],
      [
        {
          "type": "text",
          "content": "\\begin{aligned} &\\quad p = -8, \\quad \\text{other zero is } 2 \\end{aligned}"
        }
      ]
    ],
    "correct_answer": 3,
    "correct_solution": [
      {
        "type": "text",
        "content": "\\begin{aligned} &\\text{Given one zero } \\alpha = \\frac{2}{3}, \\text{ quadratic polynomial } 3x^2 + px + 4 \\\\ &\\text{Sum of zeroes } \\alpha + \\beta = -\\frac{p}{3} \\\\ &\\text{Product of zeroes } \\alpha \\cdot \\beta = \\frac{4}{3} \\\\ &\\therefore \\quad \\frac{2}{3} \\cdot \\beta = \\frac{4}{3} \\\\ &\\implies \\quad \\beta = 2 \\\\ &\\therefore \\quad \\frac{2}{3} + 2 = -\\frac{p}{3} \\\\ &\\implies \\quad \\frac{8}{3} = -\\frac{p}{3} \\\\ &\\implies \\quad p = -8 \\\\ &\\therefore \\quad \\text{The value of } p \\text{ is } -8 \\text{ and the other zero is } 2. \\end{aligned}"
      }
    ],
    "name": null,
    "lu_id": "LU001436 : Relationship between zeroes and coefficients of a quadratic polynomial",
    "lo_id": "(LU001436.003); Default - Apply",
    "is_clone": 0,
    "is_latex": true
  }
];


export default function QuestionData() {
    return (
        <div>
          <h1>Question Display</h1>
          {questionData.map((question) => (
            <Question key={question.question_id} question={question} />
          ))}
        </div>
      );
  }