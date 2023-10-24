import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import {
  Avatar, Button, Card, Checkbox, Container, Table, TableBody,
  TableCell, TableContainer,
  TablePagination, TableRow, Typography
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// utils
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
// sections
import ConfirmDialog from '../../../components/ConfirmDialog';
// sections
import Iconify from '../../../components/Iconify';
import DataGridListHead from '../../../components/datagrid/DataGridListHead';
import DataGridListToolbar from '../../../components/datagrid/DataGridListToolbar';
import { FormProvider } from '../../../components/hook-form';
import { TableNoData } from '../../../components/table';
import TableFilterSlidebar from '../../../components/table/TableFilterSlidebar';
import { mediaBaseURL } from '../../../config';
import useLocales from '../../../hooks/useLocales';
import { getMediaUsers, setMediaUserSearch } from '../../../redux/slices/sim/sim.user';
import UserMoreMenu from '../../../sections/sim/user/UserMoreMenu';
import { deleteMediaUserAPI, deleteMediaUsersAPI } from '../../../service/sim/sim.user.service';

export default function MediaUserList() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { users, totalElements, numberOfElements, search, error } = useSelector((state) => state.mediaUser);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const TABLE_HEAD = [
    { id: 'id', label: translate('media.user.id'), alignRight: false, checked: false, sort: true },
    { id: 'name', label: translate('media.user.name'), alignRight: false, checked: true, sort: true },
    { id: 'username', label: translate('media.user.username'), alignRight: false, checked: true, sort: true },
    { id: 'phone', label: translate('media.user.phone'), alignRight: false, checked: true, sort: true },
    { id: 'email', label: translate('media.user.email'), alignRight: false, checked: true, sort: true },
    { id: 'role', label: translate('media.user.roles'), alignRight: false, checked: true, sort: false },
    { id: 'note', label: translate('media.user.note'), alignRight: false, checked: false, sort: false },
    { id: 'enabled', label: translate('media.user.disabled'), alignRight: false, checked: true, sort: false },
    { id: 'createdAt', label: translate('media.user.createdAt'), alignRight: false, checked: false, sort: true },
    { id: '', label: translate('label.actions'), alignRight: true, checked: true, sort: false }
  ];

  // goi lai redux neu search thay doi
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getMediaUsers());
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);// eslint-disable-line react-hooks/exhaustive-deps

  // sap xep
  const handleRequestSort = (property) => {
    const isAsc = search.orders[0].property === property && search.orders[0].order === 'asc';
    const order = (isAsc ? 'desc' : 'asc');

    dispatch(setMediaUserSearch({
      ...search, orders: [
        {
          order,
          property
        }
      ]
    }));
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const selected = users.map((n) => n.id);
      setSelected(selected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setMediaUserSearch({
      ...search, page: 0, size: parseInt(event.target.value, 10)
    }));
  };

  const handleChangePage = (page) => {
    dispatch(setMediaUserSearch({
      ...search, page
    }));
  };

  const handleFilterByName = (value) => {
    dispatch(setMediaUserSearch({
      ...search, value
    }));
  };

  const handleDelete = async (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const confirmDeleteItem = async () => {
    let resp;
    if (selected.length > 0)
      resp = await deleteMediaUsersAPI(selected);
    else
      resp = await deleteMediaUserAPI(selectedId);

    handleDeleteResponse(resp);
  };

  const handleDeleteItems = async () => {
    setOpen(true);
  };

  const handleDeleteResponse = (resp) => {
    setOpen(false);
    if (resp.code === "200") {
      enqueueSnackbar(translate('message.deleteSuccess'), { variant: 'success' });
      dispatch(getMediaUsers());
      setSelected([]);
    } else
      enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  const defaultValues = {
    checkedColumns: TABLE_HEAD.filter(item => item.checked).map(item => item.label),
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch } = methods;

  const { checkedColumns } = watch();

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    reset();
    handleCloseFilter();
  };

  return (
    <Page title={translate('media.user.listAccount')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('media.user.listAccount')}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.sim'),
              href: PATH_DASHBOARD.sim.users,
            },
            { name: translate('menu.user') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.sim.newUser}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              {translate('button.new')}
            </Button>
          }
        />

        <FormProvider methods={methods}>
          <TableFilterSlidebar
            onResetAll={handleResetFilter}
            isOpen={openFilter}
            onOpen={handleOpenFilter}
            onClose={handleCloseFilter}
            columns={TABLE_HEAD.map(item => item.label)}
          />
        </FormProvider>

        <Card>
          <DataGridListToolbar
            numSelected={selected.length}
            filterName={search.value}
            onFilterName={handleFilterByName}
            onDelete={() => handleDeleteItems()}
            showFilter={handleOpenFilter}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DataGridListHead
                  order={search.orders[0].order}
                  orderBy={search.orders[0].property}
                  headLabel={TABLE_HEAD.filter(head => checkedColumns.indexOf(head.label) > -1)}
                  rowCount={numberOfElements}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {users.map((row) => {
                    const { id } = row;

                    const isItemSelected = selected.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(id)} />
                        </TableCell>

                        {TABLE_HEAD.map(head => {
                          if (checkedColumns.indexOf(head.label) === -1) return null;

                          if (head.id === 'name')
                            return <TableCell sx={{ display: 'flex', alignItems: 'center' }} key={head.id}>
                              <Avatar alt={row[head.id]} title={row[head.id]} src={`${mediaBaseURL}/media/download/${row.photoURL}`} sx={{ mr: 2, alignItems: 'center' }} />
                              <Typography variant="subtitle2" noWrap>
                                {row[head.id]}
                              </Typography>
                            </TableCell>;

                          if (head.id === '')
                            return <TableCell align="right" key={head.id}>
                              <UserMoreMenu id={id}
                                pathView={`${PATH_DASHBOARD.sim.root}/user/${id}/view`}
                                onDelete={() => handleDelete(id)} />
                            </TableCell>;

                          if (head.id === 'role')
                            return (
                              <TableCell key={head.id}>
                                {row[head.id]?.name}
                              </TableCell>
                            );

                          if (head.id === 'enabled')
                            return (<TableCell key={head.id}>
                              {row[head.id]?.toString()}
                            </TableCell>);

                          return (<TableCell key={head.id}>
                            {row[head.id]}
                          </TableCell>);
                        })}

                      </TableRow>
                    );
                  })}

                  <TableNoData
                    isNotFound={numberOfElements === 0}
                    error={error}
                    length={checkedColumns.length + 1}
                    searchQuery={search.value}
                  />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalElements}
            rowsPerPage={search.size}
            page={search.page}
            onPageChange={(_, value) => handleChangePage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <ConfirmDialog values={{ title: translate("message.dialogDeleteTitle"), content: translate("message.dialogDeleteContent") }}
          onClose={() => setOpen(false)} isOpen={open} onSubmit={confirmDeleteItem} />
      </Container>
    </Page >
  );
}
