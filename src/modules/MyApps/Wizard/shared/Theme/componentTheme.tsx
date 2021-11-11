import React, {useState} from 'react';
import {Grid, Typography, Box} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {makeStyles} from '@material-ui/core/styles';

import {ColorInput} from 'shared/components/ColorInput';
import {ColorResult} from 'react-color';
import {Accordion, AccordionDetails, AccordionSummary} from '../Accordion';
import {HelpText, getHelpText} from '..';
import {ThemeProperties} from 'types/myApps';

const useStyles = makeStyles((theme) => ({
  root: (props: {color: string}) => ({
    width: '2rem',
    marginInline: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: props.color,
  }),
  image: {
    maxWidth: 230,
    maxHeight: 230,
  },
}));

interface ComponentsThemeProps {
  label: string;
  name: string;
  themeName: string;
  className: string;
  value: ColorResult;
  onChange?: ($e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  editable?: boolean;
  help: HelpText<Partial<ThemeProperties>>;
  logo?: string;
}
const ComponentTheme: React.FC<ComponentsThemeProps> = (props) => {
  const {name, label, className, onChange, value, editable, help, logo} = props;
  const [color, setColor] = useState(value.hex);
  const [expanded, setExpanded] = React.useState(false);
  const classes = useStyles({color});
  const handleChange = (panel: React.ChangeEvent<any>, expanded: boolean) => {
    setExpanded(expanded);
  };
  return (
    <>
      <Grid item xs={12} md={6} sm={6}>
        <Accordion square expanded={expanded} onChange={handleChange}>
          <AccordionSummary
            aria-controls='panel1d-content'
            id='panel1d-header'
            expandIcon={<ExpandMoreIcon />}>
            <Typography>{label}</Typography>
            <span className={classes.root}></span>
          </AccordionSummary>
          <AccordionDetails>
            <Box flex={1} display={'flex'}>
              <ColorInput
                value={color}
                onChange={(_color, $event) => {
                  if (Boolean(editable)) {
                    setColor(_color.hex);
                  }
                  if (onChange != null && Boolean(editable)) {
                    onChange($event, _color.hex);
                  }
                }}
                key={`${name}.${className}`}
                disabled={!Boolean(editable)}
              />
              {logo && (
                <Box
                  margin={'auto'}
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'center'}>
                  <Typography>{getHelpText(help, className, 0)}</Typography>
                  <img
                    alt=''
                    loading='lazy'
                    className={classes.image}
                    src={logo}
                  />
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </>
  );
};

export default ComponentTheme;
