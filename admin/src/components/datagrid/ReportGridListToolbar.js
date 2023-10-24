import PropTypes from 'prop-types';
// @mui
import { IconButton, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import DatePicker from '@mui/lab/DatePicker';
import { parse } from 'date-fns';
// components
import useLocales from '../../hooks/useLocales';
import Iconify from '../Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

// ----------------------------------------------------------------------

ReportGridListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterStartAt: PropTypes.string,
  filterEndAt: PropTypes.string,
  onFilterStartAt: PropTypes.func,
  onFilterEndAt: PropTypes.func,
  onDelete: PropTypes.func,
  showFilter: PropTypes.func,
  actions: PropTypes.node
};

export default function ReportGridListToolbar({ numSelected, filterStartAt, filterEndAt,  onFilterStartAt, onFilterEndAt, onDelete, showFilter, actions }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { translate } = useLocales();

  if (numSelected > 0)
    return (
      <RootStyle sx={{
        color: isLight ? 'primary.main' : 'text.primary',
        bgcolor: isLight ? 'primary.lighter' : 'primary.dark',
      }}>
        <Typography component="div" variant="subtitle1">
          {numSelected} {translate("label.selected")}
        </Typography>

        {actions && actions || (
          <Tooltip title="Delete">
            <IconButton onClick={onDelete}>
              <Iconify icon={'eva:trash-2-outline'} />
            </IconButton>
          </Tooltip>
        )}
      </RootStyle>
    );
function formatDateToDDMMYYYY(isoDateString) {
  const date = new Date(isoDateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Lưu ý: Tháng trong JavaScript là từ 0 đến 11, nên cần cộng thêm 1.
  const year = date.getFullYear();
  
  // Đảm bảo rằng ngày và tháng luôn có hai chữ số
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${formattedDay}/${formattedMonth}/${year}`;
}

function parseDateStringToDate(dateString) {
  // Định dạng ngày/tháng/năm
  const dateFormat = 'dd/MM/yyyy';

  try {
    const parsedDate = parse(dateString, dateFormat, new Date());
    return parsedDate;
  } catch (error) {
    console.error('Không thể chuyển đổi chuỗi ngày thành đối tượng Date:', error);
    return null;
  }
}

  return (
    <RootStyle>
          <DatePicker
            label="Từ ngày"
            value={parseDateStringToDate(filterStartAt)}
            inputFormat='dd/MM/yyyy'
            onChange={(event) => onFilterStartAt(formatDateToDDMMYYYY(event))}
            renderInput={(params) => (
              <TextField {...params} />
            )}
          />
          <DatePicker
            label="Tới ngày"
            value={parseDateStringToDate(filterEndAt)}
            inputFormat='dd/MM/yyyy'
            onChange={(event) => onFilterEndAt(formatDateToDDMMYYYY(event))}
            renderInput={(params) => (
              <TextField {...params} />
            )}
          />
      <Tooltip title="Filter list">
        <IconButton onClick={showFilter}>
          <Iconify icon={'ic:round-filter-list'} />
        </IconButton>
      </Tooltip>
    </RootStyle>
  );
}
