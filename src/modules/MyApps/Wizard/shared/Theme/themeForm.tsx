import React, {useEffect, useMemo, useState} from 'react';
import GridContainer from '@crema/core/GridContainer';
import {
  Accordion,
  AccordionSummary,
  Box,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  Button,
} from '@material-ui/core';
import {HELP_TEXT_THEME} from '.';
import ComponentTheme from './componentTheme';
import {AccordionDetails} from '../Accordion';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {CremaTheme} from 'types/AppContextPropsType';
import {
  ConfigFileExchange,
  ConfigFileMarketplace,
  PartialTheme,
  ThemeProperties,
} from 'types/myApps';
import {ColorResult} from 'react-color';

import ColorSets from 'shared/constants/ColorSets';
import {string} from 'prop-types';

type ConfigFileWithTheme = ConfigFileExchange | ConfigFileMarketplace;
interface ThemeFormProps {
  themeName: string;
  theme?: PartialTheme;
  changeIssuerForm?: (key: keyof ConfigFileWithTheme, value: any) => void;
  editable?: boolean;
}

const components: Map<string, keyof ThemeProperties> = new Map<
  string,
  keyof ThemeProperties
>([
  ['Background', 'background'],
  ['Card Background', 'cardBackgroundColor'],
  ['Card Header Background', 'cardHeaderBackgroundColor'],
  ['Top Bar Background', 'topbarBackgroundColor'],
  ['Inactive Tab Background', 'inactiveTabBackgroundColor'],
  ['Text Input Background', 'textInputBackgroundColor'],
]);

const defaultValues: Map<keyof ThemeProperties, string> = new Map<
  keyof ThemeProperties,
  string
>([
  ['background', ColorSets[0].PrimaryColor],
  ['cardBackgroundColor', ColorSets[1].PrimaryColor],
  ['cardHeaderBackgroundColor', ColorSets[2].PrimaryColor],
  ['topbarBackgroundColor', ColorSets[3].PrimaryColor],
  ['inactiveTabBackgroundColor', ColorSets[4].PrimaryColor],
  ['textInputBackgroundColor', ColorSets[5].PrimaryColor],
]);

interface ThemeOptions {
  label: string;
  value: 'theme_dark' | 'theme_light';
}
const themesOptions: ThemeOptions[] = [
  {value: 'theme_dark', label: 'Dark'},
  {value: 'theme_light', label: 'Light'},
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
    marginInline: '10px',
  },
  section: {
    marginBlock: '20px',
  },
}));

const ThemeForm: React.FC<ThemeFormProps> = (props) => {
  const classes = useStyles();
  const {themeName, theme: startTheme, changeIssuerForm, editable} = props;
  const [theme, setTheme] = useState(startTheme);
  const [selectedOption, setSelectedOption] = useState(themesOptions[0]);
  const [componentes, setComponentes] = useState(components);
  // const themeNameForm = themeName === 'DARK_THEME' ? 'theme_dark' : 'theme_light';
  console.log(`theme`, theme);

  const onChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
    child: React.ReactNode,
  ) => {
    const {
      target: {value},
    } = event;
    const themeIndex = themesOptions.findIndex((t) => t.value === value);
    const themeNameFormOptions =
      themeIndex > 0 ? themesOptions[themeIndex] : themesOptions[0];
    setSelectedOption(themeNameFormOptions);
  };

  const getValue = (k: string) => {
    const property = componentes.get(k);
    let defaultColor: string;
    if (property != null && theme != null && theme.componentsTheme != null) {
      console.log(`entrou 1`, theme.componentsTheme[property]);
      defaultColor = theme.componentsTheme[property] ?? '#FFFFFF';
    } else if (property != null) {
      defaultColor = defaultValues.get(property) ?? '#FFFFFF';
      console.log(`entrou 2`);
    } else {
      defaultColor = '#FFFFFF';
      console.log(`entrou 3`);
    }
    const value: ColorResult = {
      hex: defaultColor,
      hsl: {
        h: 0,
        s: 0,
        l: 100,
      },
      rgb: {
        b: 255,
        g: 255,
        r: 255,
      },
    };
    if (theme != null && theme?.componentsTheme != null && property != null) {
      value.hex = theme.componentsTheme[property] ?? defaultColor;
    }
    return value;
  };

  const resetAll = () => {
    if (theme != null) {
      componentes.forEach((property, key) => {
        if (theme?.componentsTheme != null) {
          const _valor = defaultValues.get(property);
          console.log(key, _valor);
          console.log('valor antes', theme.componentsTheme[property]);
          theme.componentsTheme[property] = _valor;
          console.log('valor depois', theme.componentsTheme[property]);
        }
      });
      setTheme({...theme});
      setComponentes(
        new Map<string, keyof ThemeProperties>(componentes.entries()),
      );
    }
    if (changeIssuerForm != null) {
      console.log('aqui');
      changeIssuerForm('theme', theme);
      changeIssuerForm(selectedOption.value, theme);
    }
  };
  useEffect(() => {
    if (theme == null || Object.keys(theme).length === 0) {
      const _theme = Array.from(componentes.values()).reduce((obj, key, i) => {
        return {
          ...obj,
          [key]: defaultValues.get(key),
        };
      }, {} as ThemeProperties);
      setTheme({
        componentsTheme: _theme,
      });
    }
  }, []);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'>
        <Typography
          className={classes.heading}
          variant='subtitle2'
          component='h2'>
          Costumize Dex {themeName} Theme colors:
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box component='section' width='100%' className={classes.section}>
          <InputLabel>
            <span>Select themes to edit:</span>
            <Select
              value={selectedOption.value}
              onChange={onChange}
              className={classes.select}
              disabled={!Boolean(editable)}>
              {themesOptions.map((opt, i) => (
                <MenuItem key={i} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </InputLabel>
          <Button color='primary' onClick={resetAll}>
            {' '}
            Reset All
          </Button>
        </Box>
        <Box component='section' className={classes.section}>
          <GridContainer>
            {theme?.componentsTheme
              ? Array.from(componentes.keys()).map((k) => (
                  <ComponentTheme
                    label={k}
                    key={componentes.get(k) as string}
                    className={componentes.get(k) as string}
                    name={`${selectedOption.value}.componentsTheme`}
                    themeName={themeName}
                    value={getValue(k)}
                    logo={`/assets/images/wizard-${
                      componentes.get(k) as string
                    }.png`}
                    onChange={($e, value) => {
                      const property = componentes.get(k);
                      if (
                        theme != null &&
                        theme?.componentsTheme != null &&
                        property != null
                      ) {
                        theme.componentsTheme[property] = value;
                      }
                      if (changeIssuerForm != null) {
                        changeIssuerForm('theme', theme);
                        changeIssuerForm(selectedOption.value, theme);
                      }
                    }}
                    editable={Boolean(editable)}
                    help={HELP_TEXT_THEME}
                  />
                ))
              : null}
          </GridContainer>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ThemeForm;
