import { useLocation, useParams } from 'react-router-dom';
// @mui
import { Box, Container } from '@mui/material';
// redux
import { useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import ErrorOccur from '../../../components/ErrorOccur';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import useLocales from '../../../hooks/useLocales';
import TagNewForm from '../../../sections/sim/tag/TagNewForm';

// ----------------------------------------------------------------------

export default function TagCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { translate } = useLocales();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');
  const isNew = !isEdit && !isView;
  const { error, tags } = useSelector((state) => state.tag);

  const tag = tags.find((t) => t.id === parseInt(id, 10));

  return (
    <Page title={isNew ? translate('sim.tag.newTag') : tag?.title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isNew ? translate('sim.tag.newTag') : tag?.title}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.sim'),
              href: PATH_DASHBOARD.sim.root,
            },
            {
              name: translate('menu.tag'),
              href: PATH_DASHBOARD.sim.tags,
            },
            { name: isNew ? translate('sim.tag.newTag') : tag?.title || '' },
          ]}
        />
        {error && (isEdit || isView) ? (
          <Box sx={{ py: 3 }}>
            <ErrorOccur error={error} />
          </Box>
        ) : (
          <TagNewForm isEdit={isEdit} currentItem={isEdit || isView ? tag : null} isView={isView} />
        )}
      </Container>
    </Page>
  );
}
