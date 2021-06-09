import { PartialTheme,ThemeProperties } from "types/myApps";
import { Styles } from "jss";
import { lightThemeColors, modalThemeStyle } from ".";

export class DefaultTheme implements PartialTheme {
    public componentsTheme: ThemeProperties;
    public modalTheme: Styles;
    constructor() {
        this.componentsTheme = lightThemeColors;
        this.modalTheme = modalThemeStyle;
    }
  }