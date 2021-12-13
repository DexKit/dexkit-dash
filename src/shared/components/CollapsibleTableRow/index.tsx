import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Table,
  TableRow,
} from '@material-ui/core';
import {ReactComponent as ArrowDownIcon} from '../../../assets/images/icons/arrow-down.svg';
import useStyles from './index.style';

export type Row = {
  id: string;
  title: Element;
  value: Element;
};

type CollapsibleTableRowProps = {
  summaryTitle: any;
  summaryValue: any;
  data: any[];
};

const CollapsibleTableRow: React.FC<CollapsibleTableRowProps> = ({
  summaryTitle,
  summaryValue,
  data,
}: CollapsibleTableRowProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const {
    accordionContainer,
    accordionSummary,
    accordionDetails,
    tableCell,
    rowContainer,
    tableTitle,
    openedAccordion,
  } = useStyles();
  return (
    <Accordion
      expanded={isOpen}
      onChange={() => setIsOpen(!isOpen)}
      className={`${accordionContainer} ${isOpen ? openedAccordion : ''}`}>
      <AccordionSummary
        className={accordionSummary}
        expandIcon={<ArrowDownIcon />}>
        <Box ml={'8px'} className={tableTitle}>
          {summaryTitle}
        </Box>
        <Box>{summaryValue}</Box>
      </AccordionSummary>
      <AccordionDetails className={accordionDetails}>
        <Table size='small'>
          {data.map(({title, value, id}) => {
            return (
              <TableRow key={id} className={rowContainer}>
                <Box className={`${tableCell} ${tableTitle}`}>{title}</Box>
                <Box className={tableCell}>{value}</Box>
              </TableRow>
            );
          })}
        </Table>
      </AccordionDetails>
    </Accordion>
  );
};

export default CollapsibleTableRow;
