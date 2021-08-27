import { makeStyles } from "@material-ui/core/styles";
import { CremaTheme } from "types/AppContextPropsType";


export const useStyles = makeStyles((theme: CremaTheme) => ({
    paper: {
         padding: theme.spacing(2),
    },
    paperChart: {
        padding: theme.spacing(2),
      }
  }));
  