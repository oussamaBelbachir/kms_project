import React, { Fragment, useState, useEffect } from 'react';
import './DirectionsNestedCheckbox.styles.scss';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Label from '../Label/Label.component';

function DirectionsNestedCheckbox({ init, setDirectionDepartments }) {
  const data = JSON.parse(import.meta.env.VITE_DIRECTION_DEPARTMENTS);

  const [selectedItems, setSelectedItems] = useState(init || {});
  useEffect(() => {
    if (setDirectionDepartments) {
      setDirectionDepartments(selectedItems);
    }
  }, [selectedItems]);

  const handleCheckboxChange = (e, dir, dep) => {
    setSelectedItems((prevItems) => {
      const updatedSelection = { ...prevItems };
      const dir_exists = dir in prevItems;
      if (e.target.checked) {
        if (dir_exists) {
          updatedSelection[dir] = [...updatedSelection[dir], dep];
        } else {
          updatedSelection[dir] = [dep];
        }
      } else {
        if (updatedSelection[dir].length === 1) {
          delete updatedSelection[dir];
        } else {
          updatedSelection[dir] = updatedSelection[dir].filter(
            (el) => el !== dep
          );
        }
      }
      return updatedSelection;
    });
  };

  const handleSelectAllChange = (e, dir) => {
    setSelectedItems((prevItems) => {
      const updatedSelection = { ...prevItems };
      if (e.target.checked) {
        updatedSelection[dir] = data[dir];
      } else {
        delete updatedSelection[dir];
      }
      return updatedSelection;
    });
  };

  const departmentChecked = (dir, dep) => {
    if (dir in selectedItems) {
      return selectedItems[dir].includes(dep);
    }
    return false;
  };

  const allDepartmentChecked = (dir) => {
    if (dir in selectedItems) {
      return selectedItems[dir].length === data[dir].length;
    }
    return false;
  };
  const Checkbox = ({ label, checked, onChange }) => (
    <label className="department__item">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
      <div className="checked__item">
        {checked ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
      </div>
    </label>
  );

  const SelectAllCheckbox = ({ checked, onChange }) => (
    <label className="select__all">
      <input type="checkbox" checked={checked} onChange={onChange} />
      sélectionner tout
      <div className="checked__item">
        {checked ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
      </div>
    </label>
  );
  const handleClickSimpleDirection = (dir) => {
    setSelectedItems((prevItems) => {
      const updatedSelection = { ...prevItems };
      if (dir in updatedSelection) {
        delete updatedSelection[dir];
      } else {
        updatedSelection[dir] = [];
      }
      return updatedSelection;
    });
  };

  return (
    <Fragment>
      <Label required>Directions</Label>
      <div className="directions__checkbox">
        <div className="items">
          {Object.keys(data).map((dir) => (
            <div key={dir}>
              {data[dir].length == 0 ? (
                <div
                  className="flex-center simple__direction"
                  onClick={() => handleClickSimpleDirection(dir)}
                >
                  {dir in selectedItems ? (
                    <CheckCircleIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}

                  <h3 className="direction__name">
                    {dir.split('_').join(' ')}
                  </h3>
                </div>
              ) : (
                <Fragment>
                  <h3 className="direction__name">
                    {dir.split('_').join(' ')}
                  </h3>

                  <div className="departments__choices">
                    <SelectAllCheckbox
                      checked={allDepartmentChecked(dir)}
                      onChange={(e) => handleSelectAllChange(e, dir)}
                    />
                    {data[dir].map((dep) => (
                      <div key={dep} className="departments">
                        <Checkbox
                          label={dep}
                          checked={departmentChecked(dir, dep)}
                          onChange={(e) => handleCheckboxChange(e, dir, dep)}
                        />
                      </div>
                    ))}
                  </div>
                </Fragment>
              )}
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}

export default DirectionsNestedCheckbox;
