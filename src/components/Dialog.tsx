import React from 'react';

const Dialog = (props: DialogProps) => (
  <div className='dialog--wrapper'>
    <pre className='txt-big'>{props.message}</pre>
    {props.children}
  </div>
);

type DialogProps = {
  message: IPipesServer;
  children: any;
};

export default Dialog;
