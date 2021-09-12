import React from 'react';

const Dialog = (props: DialogProps) => (
  <div className='dialog--wrapper'>
    <h1 className='txt-big'>{props.message}</h1>
    <button
      className='btn-secondary'
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.buttonText}
    </button>
  </div>
);

type DialogProps = {
  buttonText: string;
  disabled?: boolean;
  message: string;
  onClick: () => void;
};

export default Dialog;
