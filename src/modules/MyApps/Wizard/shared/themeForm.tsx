import React, { useEffect, useMemo, useState } from 'react';
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
import ComponentTheme, { AccordionDetails } from './componentTheme';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CremaTheme } from 'types/AppContextPropsType';
import { ConfigFileExchange, ConfigFileMarketplace, PartialTheme, ThemeProperties } from 'types/myApps';
import { isUndefined } from 'node:util';
import { ColorResult } from 'react-color';

type ConfigFileWithTheme = ConfigFileExchange | ConfigFileMarketplace;
interface ThemeFormProps {
  themeName: string;
  theme?: PartialTheme;
  changeIssuerForm?: (key: keyof ConfigFileWithTheme, value: any) => void;
}


const components: Map<string, keyof ThemeProperties> = new Map<string, keyof ThemeProperties>([
  ['Background', 'background'],
  ['Card Background', 'cardBackgroundColor'],
  ['Card Header Background', 'cardHeaderBackgroundColor'],
  ['Top Bar Background', 'topbarBackgroundColor'],
  ['Inactive Tab Background', 'inactiveTabBackgroundColor'],
  ['Text Input Background', 'textInputBackgroundColor']
]);

interface ThemeOptions {
  label: string;
  value: 'theme_dark' | 'theme_light';
}
const themesOptions: ThemeOptions[] = [
  { value: 'theme_dark', label: 'Dark' },
  { value: 'theme_light', label: 'Light' },
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
  const { themeName, theme:startTheme, changeIssuerForm } = props;
  const [theme, setTheme] = useState(startTheme);
  const [selectedOption, setSelectedOption] = useState(themeName === 'DARK_THEME' ? themesOptions[0] : themesOptions[1]);
  // const themeNameForm = themeName === 'DARK_THEME' ? 'theme_dark' : 'theme_light';

  const onChange = (event: React.ChangeEvent<
    {
      name?: string | undefined;
      value: unknown;
    }
  >, child: React.ReactNode) => {
    const { target: { value } } = event;
    const themeIndex = themesOptions.findIndex(t => t.value === value);
    const themeNameFormOptions = themeIndex > 0 ? themesOptions[themeIndex] : themesOptions[0];
    setSelectedOption(themeNameFormOptions);
  };
  useEffect(() => {
    if(theme == null || Object.keys(theme).length === 0){
      const _theme = Array.from(components.values())
      .reduce((obj, key,i) => { 
        return {
          ...obj,
          [key]: undefined,
        }
      }, { } as ThemeProperties);
      setTheme({ 
        componentsTheme: _theme
      });
    }
  }, []);
  const getValue = (k: string) => {
    let value: ColorResult = {
       hex: '#FFFFFF', 
       hsl: {
        h:0,
        s: 0,
        l: 100,
       }, 
       rgb: {
         b: 255,
         g: 255,
         r: 255,
       }
    };;
    const property = components.get(k);
    if(theme != null && 
      theme?.componentsTheme != null && 
      property != null
    ){
      value.hex = theme.componentsTheme[property] ?? '#FFFFFF';
    }
    return value;
  }
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
                    name={`${selectedOption.value}.componentsTheme`}
                    themeName={themeName}
                    value={getValue(k)}
                    onChange={($e, value) => {
                      const property = components.get(k);
                      if(
                        theme != null && 
                        theme?.componentsTheme != null && 
                        property != null
                      ){
                        theme.componentsTheme[property] = value;
                      }
                      if(changeIssuerForm != null){
                        changeIssuerForm('theme', theme);
                        changeIssuerForm(selectedOption.value, theme);
                      }
                    }}
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