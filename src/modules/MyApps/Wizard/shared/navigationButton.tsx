import { Button } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import React from 'react';



interface NavigationButtonProps {
  handleBack?: ($event: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void;
  handleNext?: ($event: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void;
  ButtonNextText: string;
  ButtonBackText: string;
  classes?: ClassNameMap<"button" | "root" | "actionsContainer">
}

export const NavigationButton: React.FC<NavigationButtonProps> = (props) => {
  const { handleBack, handleNext, ButtonBackText, ButtonNextText, classes } = props;
  return (
    <div className={classes?.actionsContainer}>
      <div>
        <Button
          disabled={handleBack == null}
          onClick={handleBack}
          className={classes?.button}
        >
          {ButtonBackText}
        </Button>
        <Button
          disabled={handleNext == null}
          variant="contained"
          color="primary"
          onClick={handleNext}
          className={classes?.button}
        >
          {ButtonNextText}
        </Button>
      </div>
    </div>
  )
}