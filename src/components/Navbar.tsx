import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { reset } from '../redux/slices/gameSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  return (
    <nav>
      <Link to='/' onClick={() => dispatch(reset())}>
        ← Go Back
      </Link>
    </nav>
  );
};

export default Navbar;
