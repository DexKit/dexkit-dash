import React from 'react';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import {Checkbox} from '@material-ui/core';

interface AppsStarredIcon {
  item: any;
  onChange: (checked: boolean, item: any) => void;
}

const AppsStarredIcon: React.FC<AppsStarredIcon> = ({item, onChange}) => {
  return (
    <Checkbox
      icon={<StarBorderIcon />}
      checkedIcon={<StarIcon />}
      checked={item.isStarred}
      onChange={(event) => onChange(event.target.checked, item)}
    />
  );
};

export default AppsStarredIcon;
