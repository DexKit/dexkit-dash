import { makeStyles } from "@material-ui/core"
import { CremaTheme } from "types/AppContextPropsType"
import { grey } from "@material-ui/core/colors"
import { Fonts } from "shared/constants/AppEnums";

export const useStyles = makeStyles((theme: CremaTheme) => ({
  contractAddress: {
    fontSize: 20,
    [theme.breakpoints.down('xs')]: {
      fontSize: '3.8vw',
    },
  },
}));
