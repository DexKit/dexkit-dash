import React, { useEffect, useState } from 'react';
import GridContainer from '@crema/core/GridContainer';
import {
  Accordion,
  AccordionSummary,
  Box,
  Checkbox,
  makeStyles,
  FormControlLabel,
  Typography,
  Button
} from '@material-ui/core';
import ComponentTheme from '../../shared/Theme/componentTheme';
import { AccordionDetails } from '../../shared/Accordion';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CremaTheme } from 'types/AppContextPropsType';
import { AggregatorTheme } from 'types/myApps';
import { ColorResult } from 'react-color';

import ColorSets from 'shared/constants/ColorSets';
import { HELP_TEXT_THEME } from '../../shared/Theme';
import { WizardData } from '..';

interface ThemeFormProps {
  theme: AggregatorTheme;
  changeIssuerForm?: (key: WizardData, value: any) => void;
  editable?: boolean;
}
const components: Map<string, keyof AggregatorTheme> = new Map<string, keyof AggregatorTheme>([
  ['Brand Color', 'brand_color'],
  ['Brand Color Dark', 'brand_color_dark']
]);

const defaultValues: Map<keyof AggregatorTheme, string> = new Map<keyof AggregatorTheme, string>([
  ['brand_color', ColorSets[1].PrimaryColor],
  ['brand_color_dark', ColorSets[2].PrimaryColor],
]);

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
  const { theme: startTheme, changeIssuerForm, editable } = props;
  const [theme, setTheme] = useState(startTheme);
  const [isDarkTheme, setDarkTheme] = useState(true);
  const [componentes, setComponentes] = useState(components);
  // const themeNameForm = themeName === 'DARK_THEME' ? 'theme_dark' : 'theme_light';

  const getValue = (k: string) => {
    const property = componentes.get(k);
    const defaultColor = property != null ? defaultValues.get(property) ?? '#FFFFFF' : '#FFFFFF';
    let value: ColorResult = {
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
      }
    };
    if (theme != null && property != null
      && property !== 'is_dark_mode'
    ) {
      value.hex = theme[property] as string ?? defaultColor;
    }
    return value;
  }

  const checkOnChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (!Boolean(editable)) {
      return;
    }
    setDarkTheme(Boolean(checked));
  }

  const resetAll = () => {
    if (theme != null) {
      componentes.forEach((property, key) => {
        if (theme != null && property !== 'is_dark_mode') {
          const _valor = defaultValues.get(property);
          theme[property] = _valor ?? '#FFFFFF';
        }
        theme.is_dark_mode = true;
      });
      setTheme({ ...theme });
      setComponentes(new Map<string, keyof AggregatorTheme>(componentes.entries()))
    }
    if (changeIssuerForm != null) {
      changeIssuerForm(WizardData.THEME, theme);
    }
  }
  useEffect(() => {
    if (theme == null || Object.keys(theme).length === 0) {
      const _theme = Array.from(componentes.values())
        .reduce((obj, key, i) => {
          return {
            ...obj,
            [key]: defaultValues.get(key),
          }
        }, {} as AggregatorTheme);
      setTheme({
        ..._theme
      });
    }
  }, []);

  useEffect(() => {
    theme.is_dark_mode = Boolean(isDarkTheme);
    if (changeIssuerForm != null) {
      changeIssuerForm(WizardData.THEME, { ...theme });
    }
  }, [isDarkTheme]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading} variant="subtitle2" component="h2">
          Costumize Aggregator Theme colors:
				</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box component="section" width="100%" className={classes.section}>
          <FormControlLabel
            value={(isDarkTheme) as boolean}
            control={
              <Checkbox
                value={isDarkTheme}
                defaultChecked={true}
                disabled={!Boolean(editable)}
                onChange={checkOnChange}
                name={'is_dark_mode'}
                color="primary"
              />
            }
            label={'Dark Mode as Default'}
            labelPlacement="end"
          />
          <Button color="primary" onClick={resetAll}> Reset All</Button>
        </Box>
        <Box component="section" className={classes.section}>
          <GridContainer>
            {
              theme != null ? Array.from(componentes.keys())
                .map(k =>
                  <ComponentTheme
                    label={k}
                    key={componentes.get(k) as string}
                    className={componentes.get(k) as string}
                    name={isDarkTheme ? 'Aggregator dark theme' : 'Aggregator theme'}
                    themeName={''}
                    value={getValue(k)}
                    onChange={($e, value) => {
                      const property = componentes.get(k);
                      if (property != null && property !== 'is_dark_mode') {
                        theme[property] = value;
                      }
                      if (changeIssuerForm != null) {
                        changeIssuerForm(WizardData.THEME, { ...theme });
                      }
                    }}
                    editable={Boolean(editable)}
                    help={HELP_TEXT_THEME}
                  />
                ) : null
            }
          </GridContainer>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
};

export default ThemeForm;