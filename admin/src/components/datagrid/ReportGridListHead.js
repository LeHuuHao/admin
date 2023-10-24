import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

// ----------------------------------------------------------------------



ReportGridListHead.propTypes = {
  headLabel: PropTypes.array,
};

export default function ReportGridListHead({
  headLabel,
}) {
 

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (

          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
          >
            <TableSortLabel
              hideSortIcon
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
