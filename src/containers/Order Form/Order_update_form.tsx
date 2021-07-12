import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation,gql, useQuery } from '@apollo/client';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import { Scrollbars } from 'react-custom-scrollbars';
import Select from 'components/Select/Select';
import Input from 'components/Input/Input';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import dayjs from 'dayjs';


import {
Form,
DrawerTitleWrapper,
DrawerTitle,
FieldDetails,
ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';

const GET_ORDER_ID = gql`
query	GetOneOrder($id:String!){
FindOneOrder(id:$id){
id
custumerName
custumerId
creation_date
delivery_address
Total_amount
contact
Status
guide_number
}
}
`;

const UPDATE_ORDER= gql`
mutation UpdateOrder($input: OrderInputUpdate!, $id: String!) {
UpdateOrder(input: $input, id: $id)
}
`
const CUSTUMER_ORDERS = gql`
mutation custumerOrders($id: String!, $order: Float!) {
UpdateOrderAndOrders(id: $id, order: $order)
}
`;

const options = [
    { value: 'pending', label: '1 - Pendiente de Pago' },
    { value: 'processing', label: '2 - Pago realizado' },
    { value: 'delivered', label: '3 - Enviado' },
    { value: 'failed', label: '4 - Problema' },
];


const UpdateOrder = (props) => {
const dispatch = useDrawerDispatch();
const id = useDrawerState('data')
const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
]);
const {data,loading} = useQuery(GET_ORDER_ID
,{
variables:{id},
});





const [status, setStatus] = useState('');
const [statust, setStatust] = useState('');
const [message, setMessage] = useState('');
const [guide_number, setGuide_number] = useState('');
const [stat,SetStat]= useState('')
const [setc, setsetc] = useState(true);
const { register, handleSubmit,setValue} = useForm();
React.useEffect(() => {
register({ name: 'parent' });
register({ name: 'image' });
}, [register]);

const[updateOrder]= useMutation(UPDATE_ORDER)
const[updateCustumer]= useMutation(CUSTUMER_ORDERS)


if(loading) return <h1>Cargando...</h1>
const handleSlugChange = ({ value }) => {
setValue('parent', value);
setGuide_number(value);
};

const handleMessageChange = ({ value }) => {
    // setValue('parent', value);
    setMessage(value);
    };

const handleChange = ({ value }) => {
    setValue('parent', value);
    setStatust(value);
    setStatus(value[0].label);
    // console.log(value[0].label)
}
let myNumber=data.FindOneOrder.contact.replace(/ /g,'')

function getLinkWhastapp(number, message) {
    message = message.split(' ').join('%20')
    return window.open('https://api.whatsapp.com/send?phone=' + number + '&text=%20' + message)
}


const onSubmit = async valores => {
    const {message,guide_number}= valores
    console.log(valores);
    let ship_message = message + guide_number
    if (guide_number === "" ) {
        if (valores.parent === undefined) {
            try {
            await updateOrder({
                variables:{
                id:id,
                input:{
                    Status:stat
                },
                }
            });
            switch (stat) {
                case '2 - Pago realizado':
                    getLinkWhastapp(myNumber,message)
                    break;
                case '4 - Problema':
                    getLinkWhastapp(myNumber,message)
                    break;
                case '3 - Enviado':
                        getLinkWhastapp(myNumber,ship_message);
                        updateCustumer({
                            variables:{
                                id: data.FindOneOrder.custumerId,
                                order: Number(data.FindOneOrder.Total_amount)
                            }
                        })
                    break;
            }
            closeDrawer();
            } catch (error) {
            console.log(error)
            }
        } else {
            try {
                await updateOrder({
                    variables:{
                    id:id,
                    input:{
                    Status:status
                    },
                    }
                });
                
                switch (status) {
                    case '2 - Pago realizado':
                        getLinkWhastapp(myNumber,message)
                        break;
                    case '4 - Problema':
                        getLinkWhastapp(myNumber,message)
                        break;
                    case '3 - Enviado':
                            getLinkWhastapp(myNumber,ship_message);
                            updateCustumer({
                                variables:{
                                    id: data.FindOneOrder.custumerId,
                                    order: Number(data.FindOneOrder.Total_amount)
                                }
                            })
                    break;
                }
                closeDrawer();
                } catch (error) {
                console.log(error)
                }
        }
    } else {
            try {
                await updateOrder({
                    variables:{
                    id:id,
                    input:{
                        Status:status,
                        guide_number:guide_number
                    },
                    }
                });
                switch (status) {
                    case '3 - Enviado':
                        getLinkWhastapp(myNumber,ship_message);
                        updateCustumer({
                            variables:{
                                id: data.FindOneOrder.custumerId,
                                order: Number(data.FindOneOrder.Total_amount)
                            }
                        })
                        break;
                }
                // console.log('aqui')
                closeDrawer();
                } catch (error) {
                console.log(error)
                }
        
    }
};

const set = () => {
setTimeout(()=>{
    setsetc(false)
    SetStat(data.FindOneOrder.Status)
},100)
};
if (setc === true) set()
return (
<>
<DrawerTitleWrapper>
    <DrawerTitle>Edit</DrawerTitle>
</DrawerTitleWrapper>

<Form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
    <Scrollbars
    autoHide
    renderView={(props) => (
        <div {...props} style={{ ...props.style, overflowX: 'hidden' }} />
        )}
        renderTrackHorizontal={(props) => (
        <div
        {...props}
        style={{ display: 'none' }}
        className="track-horizontal"
        />
    )}
    >
    <Row>

</Row>
<Row>
    <Col lg={4}>
    <FieldDetails>
        Estado de la orden: {stat}<br/>
        Cliente: {data.FindOneOrder.custumerName}<br/>
        Teléfono: {data.FindOneOrder.contact}<br/>
        Ordenado el: {dayjs(data.FindOneOrder.creation_date).format('DD MMM YYYY')}<br/>
    </FieldDetails>
    </Col>

    
    {/* <FieldDetails>
        {data.FindOneOrder.contact}
    </FieldDetails> */}
    

        <Col lg={8}>
        <DrawerBox>
            <FormFields>
            <FormLabel>Nuevo Estado</FormLabel>
            <Select
                options={options}
                getOptionValue
                labelKey="label"
                valueKey="value"
                placeholder={stat}
                value={statust}
                searchable={false}
                onChange={handleChange}
                overrides={{
                Placeholder: {
                    style: ({ $theme }) => {
                    return {
                        ...$theme.typography.fontBold14,
                        color: $theme.colors.textNormal,
                    };
                    },
                },
                DropdownListItem: {
                    style: ({ $theme }) => {
                    return {
                        ...$theme.typography.fontBold14,
                        color: $theme.colors.textNormal,
                    };
                    },
                },
                OptionContent: {
                    style: ({ $theme, $selected }) => {
                    return {
                        ...$theme.typography.fontBold14,
                        color: $selected
                        ? $theme.colors.textDark
                        : $theme.colors.textNormal,
                    };
                    },
                },
                SingleValue: {
                    style: ({ $theme }) => {
                    return {
                        ...$theme.typography.fontBold14,
                        color: $theme.colors.textNormal,
                    };
                    },
                },
                Popover: {
                    props: {
                    overrides: {
                        Body: {
                        style: { zIndex: 5 },
                        },
                    },
                    },
                },
                }}
            />
            </FormFields>
            {(status === '2 - Pago realizado') ?
            <FormFields>
            <FormLabel>Mensaje</FormLabel>
            <Input
                inputRef={register({maxLength: 1000 })}
                name="message"
                value={message}
                onChange={handleMessageChange}
            />
            </FormFields>
            : ''
            }
            {(status === '4 - Problema') ?
            <FormFields>
            <FormLabel>Mensaje del problema</FormLabel>
            <Input
                inputRef={register({maxLength: 1000 })}
                name="message"
                value={message}
                onChange={handleMessageChange}
            />
            </FormFields>
            : ''
            }
            {(status === '3 - Enviado') ?
            <div>
            
            <FormFields>
            <FormLabel>Mensaje</FormLabel>
            <Input
                inputRef={register({maxLength: 1000 })}
                name="message"
                value={message}
                onChange={handleMessageChange}
            />
            </FormFields>
            <FormFields>
            <FormLabel>Numero de guia</FormLabel>
            <Input
                inputRef={register({maxLength: 500 })}
                name="guide_number"
                value={guide_number}
                onChange={handleSlugChange}
            />
            </FormFields>
            </div>
            : ''
            }
            
        </DrawerBox>
        </Col>
    </Row>
    </Scrollbars>

            <ButtonGroup>
            <Button
                kind={KIND.minimal}
                onClick={closeDrawer}
                overrides={{
                BaseButton: {
                    style: ({ $theme }) => ({
                    width: '50%',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    borderBottomRightRadius: '3px',
                    borderBottomLeftRadius: '3px',
                    marginRight: '15px',
                    color: $theme.colors.red400,
                    }),
                },
                }}
            >
                Cancelar
            </Button>

            <Button
                type="submit"
                overrides={{
                BaseButton: {
                    style: ({ $theme }) => ({
                    width: '50%',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    borderBottomRightRadius: '3px',
                    borderBottomLeftRadius: '3px',
                    }),
                },
                }}
            >
                Actualizar Orden
            </Button>
            </ButtonGroup>
        </Form>
        </>
    );
    };

    export default UpdateOrder;
