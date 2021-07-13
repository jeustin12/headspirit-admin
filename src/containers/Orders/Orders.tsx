import React, { useCallback, useState } from 'react';
import { styled, withStyle, createThemedUseStyletron } from 'baseui';
import dayjs from 'dayjs';
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import Select from 'components/Select/Select';
import Button from 'components/Button/Button';
import { useQuery, gql } from '@apollo/client';
import { Wrapper, Header, Heading } from 'components/Wrapper.style';

import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledCell,
} from './Orders.style';
import NoResult from 'components/NoResult/NoResult';
import { useDrawerDispatch } from 'context/DrawerContext';

const GET_ORDERS = gql`
  query getOrders($Status:String!){
    FindallOrders(Status:$Status){
      id
      custumerName
      creation_date
      products
      delivery_address
      Total_amount
      contact
      schedule
      Status
      guide_number
    }
  }
`;

type CustomThemeT = { red400: string; textNormal: string; colors: any };
const themedUseStyletron = createThemedUseStyletron<CustomThemeT>();

const Statuss = styled('div', ({ $theme }) => ({
  ...$theme.typography.fontBold14,
  color: $theme.colors.textDark,
  display: 'flex',
  alignItems: 'center',
  lineHeight: '1',
  textTransform: 'capitalize',

  ':before': {
    content: '""',
    width: '10px',
    height: '10px',
    display: 'inline-block',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    borderBottomRightRadius: '10px',
    borderBottomLeftRadius: '10px',
    backgroundColor: $theme.borders.borderE6,
    marginRight: '10px',
  },
}));

const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 767px)': {
    marginBottom: '20px',

    ':last-child': {
      marginBottom: 0,
    },
  },
}));

const Row = withStyle(Rows, () => ({
  '@media only screen and (min-width: 768px)': {
    alignItems: 'center',
  },
}));

const statusSelectOptions = [
  { value: 'pending', label: '1 - Pendiente de pago' },
    { value: 'processing', label: '2 - Pago realizado' },
    { value: 'delivered', label: '3 - Enviado' },
    { value: 'failed', label: '4 - Inconsistencias' },
];


export default function Orders() {
  const [ID,setID]=useState('active')
  const [useCss, theme] = themedUseStyletron();
  const dispatch = useDrawerDispatch();
  
  const passid =(id)=>{
    setID(id)
    setTimeout(() => {
      if (ID === 'active') {
        console.log('')
      }
      else if (ID.length >= 1) {
        setTimeout(()=>{
          openDrawer()
          console.log(ID)
        },1000);
      } else{
        setTimeout(()=>{
          console.log(ID)
        },1000);
      }
    }, 1000);
  }
  const openDrawer = useCallback(
  () => dispatch({ 
  type: 'OPEN_DRAWER', 
  drawerComponent: 'ORDER_UPDATE_FORM',
  data:ID}),
  [dispatch,ID]);
  const sent = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.primary,
    },
  });
  const failed = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.red400,
    },
  });
  const processing = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.textNormal,
    },
  });
  const paid = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.blue400,
    },
  });

  const [status, setstatus] = useState('');

  const { data, error, refetch } = useQuery(GET_ORDERS,
    
    {
      pollInterval: 3000,
      variables:{
        Status:
        status}
    }
    );
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  function handleStatus({ value }) {
    setstatus(value);
    if (value.length) {
      refetch({
        Status: value[0].label,
      });
    } else {
      refetch({ Status: '' });
    }
  }

  
  
  // function handleSearch(event) {
  //   const { value } = event.currentTarget;
  //   setSearch(value);
  //   refetch({ searchText: value });
  // }

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Header
            style={{
              marginBottom: 30,
              boxShadow: '0 0 8px rgba(0, 0 ,0, 0.1)',
            }}
          >
            <Col md={3} xs={12}>
              <Heading>Orders</Heading>
            </Col>

            <Col md={9} xs={12}>
              <Row>
                <Col md={3} xs={12}>
                  <Select
                    options={statusSelectOptions}
                    labelKey="label"
                    valueKey="value"
                    placeholder="Status"
                    value={status}
                    searchable={false}
                    onChange={handleStatus}
                  />
                </Col>


                {/* <Col md={6} xs={12}>
                  <Input
                    value={search}
                    placeholder="Ex: Search By Address"
                    onChange={handleSearch}
                    clearable
                  />
                </Col> */}
              </Row>
            </Col>
          </Header>

          <Wrapper style={{ boxShadow: '0 0 5px rgba(0, 0 , 0, 0.05)' }}>
            <TableWrapper>
              <StyledTable $gridTemplateColumns=" minmax(170px, 100px) minmax(150px, auto)  minmax(150px, auto) minmax(170px, auto) minmax(70px, max-content) minmax(170px, auto) minmax(150px, auto) minmax(150px, auto) minmax(150px, auto) minmax(150px, auto)  ">
                <StyledHeadCell>Nombre del cliente</StyledHeadCell>
                <StyledHeadCell>Fecha del Pedido</StyledHeadCell>
                <StyledHeadCell>Productos pedidos</StyledHeadCell>
                <StyledHeadCell>Direccion de envio</StyledHeadCell>
                <StyledHeadCell>Pagar</StyledHeadCell>
                <StyledHeadCell>Numero de telefono</StyledHeadCell>
                <StyledHeadCell>Tipo de Entrega</StyledHeadCell>
                <StyledHeadCell>Estado</StyledHeadCell>
                <StyledHeadCell>Numero de guia</StyledHeadCell>
                <StyledHeadCell>Editar</StyledHeadCell>
                {data ? (
                  data.FindallOrders.length ? (
                    data.FindallOrders
                      .map((item) => Object.values(item))
                      .map((row, index) => (
                        <React.Fragment key={index}>
                          <StyledCell>{row[2]}</StyledCell>
                          <StyledCell>
                            {dayjs(row[3]).format('DD MMM YYYY')}
                          </StyledCell>
                          <StyledCell>{row[4]}</StyledCell>
                          <StyledCell>{row[5]}</StyledCell>
                          <StyledCell>₡{row[6]}</StyledCell>
                          <StyledCell>{row[7]}</StyledCell>
                          <StyledCell>{row[8]}</StyledCell>
                          <StyledCell style={{ justifyContent: 'center' }}>
                            <Statuss
                              className={
                                row[9] === '3 - Enviado'
                                ? sent
                                : row[9] === '1 - Pago pendiente'
                                ? paid
                                : row[9] === '2 - Pago realizado'
                                ? processing
                                : row[9].toLowerCase() === '4 - Inconsistencias'
                                ? failed
                                : ''
                              }
                              >
                              {row[9]}
                            </Statuss>
                          </StyledCell>
                        <StyledCell>{row[10]}</StyledCell>
                          <StyledCell>
                          <Button
                        onClick={()=>{passid(row[1])}}
                        overrides={{
                          BaseButton: {
                            style: () => ({
                              width: '100%',
                              borderTopLeftRadius: '3px',
                              borderTopRightRadius: '3px',
                              borderBottomLeftRadius: '3px',
                              borderBottomRightRadius: '3px',
                            }),
                          },
                        }}
                        >
                          Edit
                        </Button>
                          </StyledCell>
                        </React.Fragment>
                      ))
                  ) : (
                    <NoResult
                      hideButton={false}
                      style={{
                        gridColumnStart: '1',
                        gridColumnEnd: 'one',
                      }}
                    />
                  )
                ) : null}
              </StyledTable>
            </TableWrapper>
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
}
