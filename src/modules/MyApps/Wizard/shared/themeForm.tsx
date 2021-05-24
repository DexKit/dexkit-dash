import React, { useState } from 'react';
import GridContainer from '@crema/core/GridContainer';
import {
  Accordion,
  AccordionSummary,
  Box,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core';
import ComponentTheme, { AccordionDetails } from '../aggregator/componentTheme';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CremaTheme } from 'types/AppContextPropsType';


interface ThemeFormProps {
  themeName: string;
}

const components: Map<string, string> = new Map<string, string>([
  ['Background', 'background'],
  ['Card Background', 'cardBackgroundColor'],
  ['Card Header Background', 'cardHeaderBackgroundColor'],
  ['Top Bar Background', 'topbarBackgroundColor'],
  ['Inactive Tab Background', 'inactiveTabBackgroundColor'],
  ['Text Input Background', 'textInputBackgroundColor']
]);

const themesOptions = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

const useStyles = makeStyles((theme: CremaTheme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  select: {
    marginInline: '10px'
  },
  section: {
    marginBlock: '20px'
  }
}));

const ThemeForm: React.FC<ThemeFormProps> = (props) => {
  const classes = useStyles();
  const { themeName } = props;
  const [selectedOption, setSelectedOption] = useState(themeName === 'DARK_THEME' ? themesOptions[0] : themesOptions[1]);
  const themeNameForm = themeName === 'DARK_THEME' ? 'theme_dark' : 'theme_light';

  const onChange = (event: React.ChangeEvent<
    {
      name?: string | undefined;
      value: unknown;
    }
  >, child: React.ReactNode) => {
    const { target: { value } } = event;
    const themeIndex = themesOptions.findIndex(t => t.value === value);
    const theme = themeIndex > 0 ? themesOptions[themeIndex] : themesOptions[0];
    console.log('theme', theme);
    setSelectedOption(theme);
  };
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading} variant="subtitle2" component="h2">
          Costumize Dex {themeName} Theme colors:
				</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box component="section" width="100%" className={classes.section}>
          <InputLabel >
            <span>Style Themes:</span>
            <Select value={selectedOption.value} onChange={onChange} className={classes.select}>
              {
                themesOptions.map((opt, i) => <MenuItem key={i} value={opt.value}>{opt.label}</MenuItem>)
              }
            </Select>
          </InputLabel>
        </Box>
        <Box component="section" className={classes.section}>
          <GridContainer>
            {
              Array.from(components.keys())
                .map(k =>
                  <ComponentTheme
                    label={k}
                    className={components.get(k) as string}
                    name={`${themeNameForm}.componentsTheme`}
                    themeName={themeName}
                  />
                )
            }
          </GridContainer>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
};

export default ThemeForm;