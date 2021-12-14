import {NavStyle} from '../../../shared/constants/AppEnums';
import MiniSidebarToggle from './MiniSidebarToggle';

interface LayoutsProps {
  [x: string]: any;
}

const Layouts: LayoutsProps = {
  [NavStyle.MINI_SIDEBAR_TOGGLE]: MiniSidebarToggle,
};
export default Layouts;
