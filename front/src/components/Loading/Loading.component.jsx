import React from 'react';
import './Loading.styles.scss';
import LoadingLogo from '../../assets/loading__logo.png';

function Loading({ full }) {
  return (
    <div className={`loading__page ${full ? 'full' : ''}`}>
      <img className="loading__logo" src={LoadingLogo} />
    </div>
  );
}

export default Loading;
