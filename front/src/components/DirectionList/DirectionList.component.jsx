import React, { useState } from 'react';
import './DirectionList.styles.scss';
import AddIcon from '@mui/icons-material/Add';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
function DirectionList({ direction, departments }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="direction__list">
      <div className="direction flex-center" onClick={() => setOpen(!open)}>
        {departments.length > 0 && (
          <AddIcon className={`${open ? 'open' : 'close'}`} />
        )}
        <span>{direction.split('_').join(' ')}</span>
      </div>

      {departments.length > 0 && (
        <div className={`departments ${open ? 'open' : 'close'}`}>
          <div className="grid-2">
            {departments?.map((el) => (
              <div key={el} className="item flex-center">
                <ArrowRightIcon />
                <span>{el}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DirectionList;
