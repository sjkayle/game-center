import React from 'react';

const Button = (props: ButtonProps) => (
  <button
    className={`btn-${props.type}`}
    onClick={props.onClick}
    disabled={props.disabled}
  >
    {props.text}
  </button>
);

type ButtonProps = {
  disabled?: boolean;
  text: string;
  type: string;
  onClick: () => void;
};

export default Button;
