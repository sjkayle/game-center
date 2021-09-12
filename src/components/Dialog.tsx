import React from 'react';

const Dialog = (props: DialogProps) => (
  <div className='dialog--wrapper'>
    <pre className='txt-big'>{props.message}</pre>
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
  message: IPipesServer;
  onClick: () => void;
};

export default Dialog;
