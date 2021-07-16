import React from 'react';
import {
  ProductCardWrapper,
  ProductImageWrapper,
  ProductInfo,
  SaleTag,
  DiscountPercent,
  Image,
  ProductTitle,
  ProductWeight,
  ProductMeta,
  OrderID,
  ProductPriceWrapper,
  ProductPrice,
  DiscountedPrice,
} from './ProductCard.style';
import { useDrawerDispatch } from 'context/DrawerContext';
import Button from 'components/Button/Button';
import { useMutation,gql} from '@apollo/client';
import Swal from 'sweetalert2';

const CREATE_PRODUCT= gql`
mutation updateProduct($id: String!, $updateProductInput: UpdateProductInput!) {
  updateProduct(id:$id,updateProductInput:$updateProductInput)
}
`
const DELETE_PRODUCT=gql`
mutation deleteProduct($id: String!){
  removeProduct(id:$id)
}
`;


type ProductCardProps = {
  title: string;
  image: any;
  weight?: string;
  currency?: string;
  description?: string;
  price: number;
  salePrice?: number;
  orderId?: number;
  discountInPercent?: number;
  data: any;
  quantity:any;
};

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  image,
  weight,
  price,
  salePrice,
  discountInPercent,
  currency,
  data,
  orderId,
  quantity,
  ...props
}) => {
const dispatch = useDrawerDispatch();
const [deleteProduct]= useMutation(DELETE_PRODUCT)
const[createProduct]=useMutation(CREATE_PRODUCT)

  const openDrawer = React.useCallback(
    () =>
      dispatch({
        type: 'OPEN_DRAWER',
        drawerComponent: 'PRODUCT_UPDATE_FORM',
        data: data,
      }),
    [dispatch, data]
  );
  const isActive = () => {
    if (data.isActive=== "active") {
      createProduct({
        variables: {
          id:data.id,
          updateProductInput: {
            isActive: 'no'
          }
        },
      });
      console.log('deactived')
    } else {
      createProduct({
        variables: {
          id:data.id,
          updateProductInput: {
            isActive: 'active'
          }
        },
      });
      console.log('actived')
    }
  };
  const DeleteProduct =()=>{
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
          await deleteProduct({
            variables:{
              id:data.id
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
    <>
    <ProductCardWrapper
      {...props}
      className="product-card"
      // onClick={openDrawer}
    >
      <ProductImageWrapper>
        <Image url={image} className="product-image" />
        {discountInPercent && discountInPercent !== 0 ? (
          <>
            <SaleTag>Sale</SaleTag>
            <DiscountPercent>{discountInPercent}% Off</DiscountPercent>
          </>
        ) : null}
      </ProductImageWrapper>
      <ProductInfo>
        <ProductTitle>{title}</ProductTitle>
        <ProductWeight>{weight}</ProductWeight>
        <ProductMeta>
          <ProductPriceWrapper>
            <ProductPrice>
              {currency}
              {salePrice && salePrice !== 0 ? salePrice : price}
            </ProductPrice>
            {discountInPercent && discountInPercent !== 0 ? (
              <DiscountedPrice>
                {currency}
                {price}
              </DiscountedPrice>
            ) : null}
          </ProductPriceWrapper>
          <h5
          style={{
            color:"#CBC0D3"
          }}>Invertario:{quantity}</h5>
          <OrderID>{orderId}</OrderID>
        </ProductMeta>
      </ProductInfo>
      {data.isActive === "active" ? <Button
                  onClick={()=>{isActive()}}

                  overrides={{
                    BaseButton: {
                      style: () => ({
                        width: '40%',
                        height:'10%',
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                        borderBottomLeftRadius: '3px',
                        borderBottomRightRadius: '3px',
                        background:"#CBC0D3",
                        marginRight:"10%"
                      }),
                    },
                  }}
                >
                  Deactive
                </Button>: <Button
                  onClick={()=>{isActive()}}

                  overrides={{
                    BaseButton: {
                      style: () => ({
                        width: '40%',
                        height:'10%',
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                        borderBottomLeftRadius: '3px',
                        borderBottomRightRadius: '3px',
                        background:"#CBC0D3",
                        marginRight:"10%"
                      }),
                    },
                  }}
                >
                  activate
                </Button>}

                <Button
                  onClick={openDrawer}
                  overrides={{
                    BaseButton: {
                      style: () => ({
                        width: '40%',
                        height:'10%',
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                        borderBottomLeftRadius: '3px',
                        borderBottomRightRadius: '3px',
                        background:"#CBC0D3",
                        marginLeft:"10%"
                      }),
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={()=>{DeleteProduct()}}
                  // onClick={()=>{isActive()}}
                  overrides={{
                    BaseButton: {
                      style: () => ({
                        width: '100%',
                        height:'10%',
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                        borderBottomLeftRadius: '3px',
                        borderBottomRightRadius: '3px',
                        background:"#ff0000",
                        marginTop:"10%",
                        marginBottom:"5%",
                      }),
                    },
                  }}
                >
                  Delete
                </Button>
    </ProductCardWrapper>
    </>

  );
};

export default ProductCard;
