import React, { useState } from 'react';
import { withStyle} from 'baseui';
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
      delivery_address
      Products
      Total_amount
      contact
      schedule
      Status
      guide_number
    }
  }
`;

// type CustomThemeT = { red400: string; textNormal: string; colors: any };
// const themedUseStyletron = createThemedUseStyletron<CustomThemeT>();



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
  // const [useCss, theme] = themedUseStyletron();
  const dispatch = useDrawerDispatch();
  
  const passid =(id)=>{
    dispatch({ 
      type: 'OPEN_DRAWER', 
      drawerComponent: 'ORDER_UPDATE_FORM',
      data:id})
  }
  // const sent = useCss({
  //   ':before': {
  //     content: '""',
  //     backgroundColor: theme.colors.primary,
  //   },
  // });
  // const failed = useCss({
  //   ':before': {
  //     content: '""',
  //     backgroundColor: "blue",
  //   },
  // });
  // const processing = useCss({
  //   ':before': {
  //     content: '""',
  //     backgroundColor: theme.colors.textNormal,
  //   },
  // });
  // const paid = useCss({
  //   ':before': {
  //     content: '""',
  //     backgroundColor: theme.colors.blue400,
  //   },
  // });

  const [status, setstatus] = useState('');
  const [statust, setstatust] = useState('');

  const { data, error, refetch ,loading} = useQuery(GET_ORDERS,
    
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
    if(value === []){
      setstatus('');
    }
    setstatust(value)
    if (value.length) {
      refetch({
        Status: value[0].label,
      });
    } else {
      refetch({ Status: '' });
    }
  }
  if (loading) {
    return <h1>Cargando</h1>
  }
  let orden = data.FindallOrders.slice().sort((a, b) => a.id - b.id);
  // let Ship_type = orden.sort();
  // console.log(Ship_type);
  
  
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
                    placeholder="Estado"
                    value={statust}
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
              <StyledTable $gridTemplateColumns=" minmax(170px, 100px) minmax(150px, auto) minmax(300px, 200px) minmax(300px, auto) minmax(100px, max-content) minmax(170px, auto) minmax(150px, auto) minmax(185px, auto) minmax(150px, auto) minmax(150px, auto)  ">
                <StyledHeadCell>Nombre del cliente</StyledHeadCell>
                <StyledHeadCell>Fecha del Pedido</StyledHeadCell>
                <StyledHeadCell>Direccion de envio</StyledHeadCell>
                <StyledHeadCell>Productos Ordenados</StyledHeadCell>
                <StyledHeadCell>Pagar</StyledHeadCell>
                <StyledHeadCell>Numero de telefono</StyledHeadCell>
                <StyledHeadCell>Tipo de Entrega</StyledHeadCell>
                <StyledHeadCell>Estado</StyledHeadCell>
                <StyledHeadCell>Numero de guia</StyledHeadCell>
                <StyledHeadCell>Editar</StyledHeadCell>
                {data ? (
                  orden.length ? (
                    orden
                      .map((item) => Object.values(item))
                      .map((row, index) => (
                        <React.Fragment key={index}>
                          <StyledCell
                          style={ index % 2? { background : "grey" }:{ background : "white" }}
                          >{row[2]}</StyledCell>
                          <StyledCell
                          style={ index % 2? { background : "grey" }:{ background : "white" }}
                          >
                            {dayjs(row[3]).format('DD MMM YYYY')}
                          </StyledCell>
                          <StyledCell
                          style={ index % 2? { background : "grey" }:{ background : "white" }}
                          >{row[4]}</StyledCell>
                          <StyledCell
                          style={ index % 2? { background : "grey" }:{ background : "white" }}
                          >{row[5]}</StyledCell>
                          <StyledCell
                          style={ index % 2? { background : "grey" }:{ background : "white" }}
                          >₡{row[6]}</StyledCell>
                          <StyledCell
                          style={ index % 2? { background : "grey" }:{ background : "white" }}
                          >{row[7]}</StyledCell>
                          <StyledCell
                          style={{
                            'backgroundColor': index % 2 ? 'grey' : 'white',
                            'color': row[8]==='Envio Express' ? 'red' : '#161F6A'
                        }}
                          >{row[8]}</StyledCell>
                          <StyledCell 
                           style={ index % 2? { background : "grey" }:{ background : "white" }}
                          >
                            {row[9]}
                          </StyledCell>

                          {(row[10]=== null ?
                          <StyledCell>
                            {row[10]}
                          </StyledCell>
                          :
                          <StyledCell
                          style={ index % 2? { background : "grey" }:{ background : "white" }}
                          >
                            {row[10]}
                          </StyledCell>
                          )}
                          
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
                          Editar
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
