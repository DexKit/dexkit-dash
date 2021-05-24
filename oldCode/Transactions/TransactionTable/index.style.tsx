import { makeStyles } from "@material-ui/core"
import { CremaTheme } from "types/AppContextPropsType"
import { grey } from "@material-ui/core/colors"
import { Fonts } from "shared/constants/AppEnums";

export const useStyles = makeStyles(() => ({
  borderBottomClass: {
    borderBottom: '0 none',
  },
  tableResponsiveMaterial: {
    minHeight: '.01%',
    overflowX: 'auto',

    '@media (max-width: 767px)': {
      width: '100%',
      marginBottom: 15,
      overflowY: 'hidden',
      border: `1px solid ${grey[300]}`,
      '& > table': {
        marginBottom: 0,
        '& > thead > tr > th, > tbody > tr > th, > tfoot > tr > th, thead > tr > td, tbody > tr > td, tfoot > tr > td': {
          whiteSpace: 'nowrap',
        },
      },
    },
  },
}));
