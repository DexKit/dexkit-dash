import {NavStyle} from '../../../shared/constants/AppEnums';
import MiniSidebarToggle from './MiniSidebarToggle';
import EmptyLayot from './EmptyLayout';

interface LayoutsProps {
  [x: string]: any;
}

const Layouts: LayoutsProps = {
  [NavStyle.MINI_SIDEBAR_TOGGLE]: MiniSidebarToggle,
  [NavStyle.EMPTY_LAYOUT]: EmptyLayot,
};
export default Layouts;
