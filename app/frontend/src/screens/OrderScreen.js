import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import NumberFormat from 'react-number-format'
import Message from '../components/Message'
import Spinner from '../components/layout/Spinner'
import PayPal from '../images/paypal.png'
import {
  getOrderDetails,
  payOrder,
  deleteOrder,
  deliverOrder,
} from '../actions/orderActions'
import { ORDER_PAY_RESET } from '../constants/orderConstants'
import CheckoutSteps from '../components/CheckoutSteps'

const OrderScreen = ({ history, match }) => {
  const orderId = match.params.id

  const [sdkReady, setSdkReady] = useState(false)
  const [payedAtDate, setPayedAtDate] = useState('')
  const [deliveredAtDate, setDeliveredAtDate] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDelivered = useSelector((state) => state.orderDelivered)
  const {
    error: deliveredError,
    loading: loadingDeliver,
    success: successDeliver,
  } = orderDelivered

  const orderDelete = useSelector((state) => state.orderDelete)
  const { error: deleteOrderError } = orderDelete

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => setSdkReady(true)
      document.body.appendChild(script)
    }

    if (!userInfo || (order && userInfo._id !== order.user._id)) {
      if (!userInfo || (userInfo && !userInfo.isAdmin)) {
        history.push('/cart')
      }
    }

    if (!order || successPay || successDeliver || order._id !== orderId) {
      if (successDeliver) {
        history.push('/admin/orders')
      }
      dispatch({ type: ORDER_PAY_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }

    if (order && order.isPaid) {
      setPayedAtDate(new Date(order.paidAt))
    }

    if (order && order.isDelivered) {
      setDeliveredAtDate(new Date(order.deliveredAt))
    }
  }, [
    history,
    userInfo,
    dispatch,
    orderId,
    successPay,
    order,
    successDeliver,
    loadingDeliver,
  ])

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult))
  }

  const deliverOrderHandler = () => {
    dispatch(deliverOrder(orderId))
  }

  const deleteOrderHandler = (orderId, userId) => {
    dispatch(deleteOrder(orderId, userId))
    if (userInfo && userInfo.isAdmin) {
      history.goBack()
    } else {
      history.push('/')
    }
  }

  return (
    <>
      <Helmet>
        <title>
          {order ? `זץ | הזמנה מספר ${order._id.slice(17, 24)}` : `זץ | הזמנה`}
        </title>
      </Helmet>
      {(userInfo && userInfo.isAdmin) || <CheckoutSteps step1 step2 step4 />}

      {userInfo && userInfo.isAdmin && (
        <Button onClick={() => history.goBack()}>Back</Button>
      )}

      {loading || loadingDeliver ? (
        <Spinner />
      ) : error ? (
        <Message variant='danger' dismissible={false}>
          {error}
        </Message>
      ) : deleteOrderError ? (
        <Message variant='danger' dismissible={false}>
          {deleteOrderError}
        </Message>
      ) : deliveredError ? (
        <Message variant='danger' dismissible={false}>
          {deliveredError}
        </Message>
      ) : (
        <>
          <h1 style={{ color: '#AAAAAA' }}>
          order number {order._id.slice(17, 24)}
          </h1>
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <Row>
                  <Col className='ml-0'>
                    <ListGroup.Item>
                    <h2>Customer Details</h2>                      <strong>Name: </strong>
                      {order.user.name}
                      <p className='mb-0'>
                      <strong>Email: </strong>
                        <a href={`mailto:${order.user.email}`}>
                          {order.user.email}
                        </a>
                      </p>
                      {order.shippingAddress.phoneNumber && (
                        <p>
                          <strong>Telephone:</strong>{' '}
                          {order.shippingAddress.phoneNumber}
                        </p>
                      )}
                      <p className='mb-0'>
                      <strong>Shipping address: </strong>
                      </p>
                      <p className='mb-0'>
                        {order.shippingAddress.address},{' '}
                        {order.shippingAddress.city}
                      </p>
                      <p className='mb-0'>
                        {order.shippingAddress.postalCode &&
                          order.shippingAddress.postalCode}
                      </p>
                      {order.isDelivered ? (
                        <Message variant='brand' dismissible={false}>
                      sent on {deliveredAtDate.toLocaleString('en-US')}
                        </Message>
                      ) : (userInfo && !userInfo.isAdmin) ||
                        (userInfo.isAdmin && !order.isPaid) ? (
                        <Message variant='danger' dismissible={false}>
                       Has not been sent yet
                        </Message>
                      ) : (
                        userInfo &&
                        userInfo.isAdmin &&
                        order.isPaid && (
                          <div className='text-center'>
                            <Button
                              type='button'
                              className='btn btn-success my-3'
                              onClick={deliverOrderHandler}
                            >
                             Marking the order as sent
                            </Button>
                          </div>
                        )
                      )}
                    </ListGroup.Item>
                  </Col>
                  {!order.isPaid && (
                    <Col className='mb-4'>
                      <ListGroup.Item
                        style={{
                          height: '290px',
                          backgroundColor: '#ec4c46',
                          color: '#272B30',
                          fontWeight: 'bold',
                        }}
                      >
                        <h3
                          className='text-center'
                          style={{ color: '#272B30' }}
                        >
                         The site is a demo site and is not a real store
                        </h3>
                        <p className='mb-0'>
                           You can "pay" via PayPal with the following email:
                         </p>
                         <small>sb-qug4m5128755@personal.example.com</small>
                         <p>
                           And with the password: <small>a/sA@o4G</small>
                         </p>
                      </ListGroup.Item>
                    </Col>
                  )}
                </Row>
                <ListGroup.Item>
                <h2>Payment method</h2>

                  {order.paymentMethod === 'PayPal' && (
                    <>
                      <Image src={PayPal} alt='PayPal' className='paypal-img' />{' '}
                      <h4
                        style={{
                          display: 'inline',
                          marginRight: '1.5rem',
                          marginLeft: '1rem',
                        }}
                      >
                      or credit card
                      </h4>
                    </>
                  )}

                  {order.isPaid ? (
                    <Message
                      variant='brand'
                      dismissible={false}
                      classN='alert-payment alert-payment-sm'
                    >
                    paid on the date {payedAtDate.toLocaleString('en-US')}
                    </Message>
                  ) : (
                    <Message
                      variant='danger'
                      dismissible={false}
                      classN='alert-payment alert-payment-sm'
                    >
                    not yet paid
                    </Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                <h2>Products on order</h2>
                  {order.orderItems.length === 0 ? (
                    <Message variant='brand' dismissible={false}>
                    The order is empty
                    </Message>
                  ) : (
                    <ListGroup variant='flush'>
                      {order.orderItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={2} className='my-auto'>
                              <Link to={`/product/${item.product}`}>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fluid
                                  rounded
                                />
                              </Link>
                            </Col>
                            <Col className='my-auto mt-4-sm'>
                              <Link to={`/product/${item.product}`}>
                                {item.name.length > 32
                                  ? `${item.name.slice(0, 32)}...`
                                  : `${item.name}`}
                              </Link>
                            </Col>
                            <Col md={5} className='my-auto mt-4-sm'>
                              {item.qty} * {item.price.toLocaleString('en-US')}{' '}
                              NIS ={' '}
                              {(item.qty * item.price).toLocaleString('en-US')}{' '}
                              ₪
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                  <h2>Order summary</h2>
                                    </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                    <Col>Total products:</Col>
                                          <Col>
                        <NumberFormat
                          value={order.itemsPrice}
                          displayType={'text'}
                          thousandSeparator={true}
                        />{' '}
                        ₪
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                    <Col>Shipping Fee:</Col>                      <Col>{order.shippingPrice} ₪</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                    <Col>Total payable:</Col>                      <Col>
                        <NumberFormat
                          value={order.totalPrice}
                          displayType={'text'}
                          thousandSeparator={true}
                        />{' '}
                        ₪
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  

                  {!order.isPaid && (
                    <ListGroup.Item>
                      {loadingPay && <Spinner />}
                      {!sdkReady ? (
                        <Spinner />
                      ) : (
                        <PayPalButton
                          amount={order.totalPrice}
                          onSuccess={successPaymentHandler}
                        />
                      )}
                    </ListGroup.Item>
                  )}

                  {!order.isPaid && (
                    <ListGroup.Item>
                      <Button
                        className='btn btn-light btn-sm btn-block'
                        onClick={() =>
                          deleteOrderHandler(order._id, order.user._id)
                        }
                      >
Canceling the order                      </Button>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default OrderScreen
