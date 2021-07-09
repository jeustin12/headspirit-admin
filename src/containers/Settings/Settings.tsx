import React, { useCallback } from 'react';
import SettingsCard from 'components/SettingsCard/SettingsCard';
import { useDrawerDispatch } from 'context/DrawerContext';
import { STAFF_MEMBERS, SITE_SETTINGS } from 'settings/constants';
import { withStyle } from 'baseui';

import { SiteSettings } from 'assets/icons/SiteSettings';
import { Members } from 'assets/icons/Members';
import { OrderIcon } from 'assets/icons/OrderIcon';
import { CouponIcon } from 'assets/icons/CouponIcon';
import { SidebarCategoryIcon } from 'assets/icons/SidebarCategoryIcon';
import { ProductIcon } from 'assets/icons/ProductIcon';
import { Grid, Row, Col as Column } from 'components/FlexBox/FlexBox';
import { useHistory } from 'react-router-dom';

const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 767px)': {
    marginBottom: '20px',

    ':last-child': {
      marginBottom: 0,
    },
  },
}));

export default function Settings() {
  let history = useHistory();

  const dispatch = useDrawerDispatch();

  const openStaffForm = useCallback(
    () =>
      dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'STAFF_MEMBER_FORM' }),
    [dispatch]
  );

  const openCategoryForm = useCallback(
    () => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'CATEGORY_FORM' }),
    [dispatch]
  );

  const openProductForm = useCallback(
    () => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'PRODUCT_FORM' }),
    [dispatch]
  );

  const openCouponForm = useCallback(
    () => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'CAMPAING_FORM' }),
    [dispatch]
  );

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={6}>
          <SettingsCard
            icon={<Members />}
            title="Empleados"
            subtitle="Maneja tus empleados desde aqui"
            onClick={() => history.push(STAFF_MEMBERS)}
          />
        </Col>
        <Col md={6}>
          <SettingsCard
            icon={<ProductIcon width="56px" height="56px" />}
            title="Añadir Productos"
            subtitle="Añade productos desde aqui"
            onClick={openProductForm}
          />
        </Col>
        
      </Row>

      <Row>

        <Col md={6}>
          <SettingsCard
            icon={<SidebarCategoryIcon width="56px" height="56px" />}
            title="Añadir categorias "
            subtitle="Añade categorias desde aqui"
            onClick={openCategoryForm}
          />
        </Col>
        
         <Col md={6}>
          <SettingsCard
            icon={<OrderIcon width="56px" height="56px" />}
            title="Añadir empleados"
            subtitle="Añade empleados desde aqui"
            onClick={openStaffForm}
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <SettingsCard
            icon={<CouponIcon width="56px" height="56px" />}
            title="Añadir cupones"
            subtitle="Añade cupones desde aqui"
            onClick={openCouponForm}
          />
        </Col>
      </Row>
    </Grid>
  );
}
