
import React, { useEffect, useState } from "react";
import { Icon } from "@material-ui/core";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import clsx from "clsx";

import { IconProps } from "modules/routesConfig";

export interface IconComponentProps {
  icon?: string | IconProps;
  classes: ClassNameMap;
}
const IconComponent: React.FC<IconComponentProps> = (props) => {
  const [type, setType] = useState<string>();
  const [src, setSrc] = useState<string>();
  const {icon, classes} = props;
  useEffect(() => {
    if (icon != null) {
      const _type = typeof icon === 'string' ? icon?.split('.')[0] : icon.type;
      const _src  = typeof icon === 'string' ? icon?.split('.')[0] : icon.src.replace(`.${icon.type}`, '');
      setSrc(_src);
      setType(_type);
    }
  }, []);

  if (src == null) {
    return <></>
  }

  if (typeof icon === 'string') {
    return (
      <Icon
        color='action'
        className={clsx('nav-item-icon', classes.listIcon)}
        {...props}
        >
        {src}
      </Icon>
    )
  }
  return (
    <Icon
      color='action'
      className={clsx('nav-item-icon', classes.listIcon)}
      {...props}
    >
      <img src={require(`assets/images/${src}.${type}`)} />
    </Icon>
  )
}


export default IconComponent;