import React, { useCallback } from 'react';
import { withStyle } from 'baseui';
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import { useDrawerDispatch } from 'context/DrawerContext';
import Button from 'components/Button/Button';

import { Plus } from 'assets/icons/PlusMinus';

import { useQuery, gql,useMutation } from '@apollo/client';

import { Wrapper, Header, Heading } from 'components/Wrapper.style';

import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledBodyCell,
} from './StaffMembers.style';
import NoResult from 'components/NoResult/NoResult';
import Swal from 'sweetalert2';

const GET_STAFFS = gql`
  query User{
  getAllUsers {
    id
    name
    number
    email
  }
}
`;

const DELETE_USER = gql`
mutation deleteUser($id: String!){
  removeUser(id:$id)
}
`

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



export default function StaffMembers() {
  const dispatch = useDrawerDispatch();

  const openDrawer = useCallback(
    () =>
      dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'STAFF_MEMBER_FORM' }),
    [dispatch]
  );
 
  
  const passid =(id)=>{
    dispatch({ type: 'OPEN_DRAWER',
      drawerComponent: 'UPDATE_STAFF_MEMBER_FORM',
      data: id})
    }

  const { data, error,loading } = useQuery(GET_STAFFS);
  const [deletestaff]= useMutation(DELETE_USER)
  if (error) {
    return <div>Error! {error.message}</div>;
  }
  if(loading)return <h1>cargando...</h1>
  console.log(data)
  // function handleCategory({ value }) {
  //   setRole(value);
  //   if (value.length) {
  //     refetch({ role: value[0].value, searchBy: search });
  //   } else {
  //     refetch({
  //       role: null,
  //     });
  //   }
  // }
  // function handleSearch(event) {
  //   const value = event.currentTarget.value;
  //   setSearch(value);
  //   refetch({ searchBy: value });
  // }
  const DeleteStaft =(id)=>{
    Swal.fire({
      title: '¿Seguro quieres eliminar el Producto?',
      text: "No seras capaz de revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!, eliminar'
    }).then(async(result)=>{
      if(result.isConfirmed){
      try {
          await deletestaff({
            variables:{
              id:id
            }
          });
          Swal.fire(
            'Eliminada',
            'success'
            )
        } catch (error) {
          console.log(error)
        }
      }
    })
  }
  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Header
            style={{
              marginBottom: 40,
              boxShadow: '0 0 5px rgba(0, 0 ,0, 0.05)',
            }}
          >
            <Col md={3} xs={12}>
              <Heading>Staff Members</Heading>
            </Col>

            <Col md={9} xs={12}>
              <Row>


                {/* <Col md={5} xs={12}>
                  <Input
                    value={search}
                    placeholder="Ex: Quick Search By Name"
                    // onChange={handleSearch}
                    clearable
                  />
                </Col> */}

                <Col md={4} xs={12}>
                  <Button
                    onClick={openDrawer}
                    startEnhancer={() => <Plus />}
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
                    Add Members
                  </Button>
                </Col>
              </Row>
            </Col>
          </Header>

          <Wrapper style={{ boxShadow: '0 0 5px rgba(0, 0 , 0, 0.05)' }}>
            <TableWrapper>
              <StyledTable $gridTemplateColumns="minmax(70px, 70px) minmax(270px, max-content) minmax(270px, max-content) minmax(150px, max-content) minmax(200px, max-content) minmax(200px, max-content)">
                <StyledHeadCell>ID</StyledHeadCell>
                <StyledHeadCell>Name</StyledHeadCell>
                <StyledHeadCell>number</StyledHeadCell>
                <StyledHeadCell>email</StyledHeadCell>
                <StyledHeadCell>Edit</StyledHeadCell>
                <StyledHeadCell>Delete</StyledHeadCell>

                {data ? (
                  data.getAllUsers.length ? (
                    data.getAllUsers
                      .map((item) => Object.values(item))
                      .map((row, index) => (
                        <React.Fragment key={index}>
                          <StyledBodyCell>{row[1].slice(0, 6)}</StyledBodyCell>
                          <StyledBodyCell>{row[2]}</StyledBodyCell>
                          <StyledBodyCell>{row[3]}</StyledBodyCell>
                          <StyledBodyCell>{row[4]}</StyledBodyCell>
                          <StyledBodyCell>
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
                        </StyledBodyCell>
                        <StyledBodyCell>
                        <Button
                        onClick={()=>{DeleteStaft(row[1])}}
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
                          Delete
                        </Button>
                        </StyledBodyCell>
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
