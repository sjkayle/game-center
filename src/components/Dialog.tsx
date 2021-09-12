import React from 'react';
import Button from './Button';

const Dialog = (props: DialogProps) => (
  <div className='dialog--wrapper'>
    <pre className='txt-big'>{props.message}</pre>
    <Button
      type='secondary'
      text={props.buttonText}
      onClick={props.onClick}
      disabled={props.disabled}
    />
  </div>
);

type DialogProps = {
  buttonText: string;
  disabled?: boolean;
  message: IPipesServer;
  onClick: () => void;
};

export default Dialog;
