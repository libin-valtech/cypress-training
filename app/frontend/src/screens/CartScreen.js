import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import { addToCart, hideToast, removeFromCart } from '../actions/cartActions'

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id

  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const { cartItems, shippingAddress } = cart

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id, qty) => {
    const message =
      qty === 1 ? 'The item has been successfully removed from the cart.' : 'The items have been successfully removed from the cart.'

    dispatch(removeFromCart(id, message))

    setTimeout(() => {
      dispatch(hideToast())
    }, 3500)
  }

  const checkoutHandler = () => {
    history.push(`/register?redirect=shipping`)
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      {cartItems.length === 0 && (
        <Button onClick={() => history.push('/')}>return</Button>
      )}
      {cartItems.length > 0 && (
        <CheckoutSteps
          step1
          isCartScreen
          step2={
            shippingAddress !== null && shippingAddress.address && userInfo
          }
          step3={
            shippingAddress !== null && shippingAddress.address && userInfo
          }
          step4={
            shippingAddress !== null && shippingAddress.address && userInfo
          }
        />
      )}
      <Row className='mt-4'>
        <Col md={8}>
          <h1 style={{ color: '#AAAAAA' }}>Shopping cart</h1>
          {cartItems.length === 0 ? (
            <>
              <Message variant='brand' dismissible={false}>
              Your shopping cart is empty...{' '}
                <span className='link' onClick={() => history.push('/')}>
                return
                </span>{' '}
              </Message>
            </>
          ) : (
            <>
              <ListGroup variant='flush'>
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.product}>
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
                      <Col md={3} className='my-auto mt-4-sm'>
                        <Link to={`/product/${item.product}`}>
                          {item.name.length > 30
                            ? `${item.name.slice(0, 30)}...`
                            : `${item.name}`}
                        </Link>
                      </Col>
                      <Col md={3} className='my-auto mt-4-sm'>
                        {item.price.toLocaleString('en-US')} $
                      </Col>
                      <Col md={2} className='my-auto mt-4-sm'>
                        <Form.Control
                          className='form-control-lg form-control-md form-control-small'
                          as='select'
                          value={item.qty}
                          onChange={(e) => {
                            dispatch(
                              addToCart(
                                item.product,
                                Number(e.target.value),
                                'The shopping cart has been updated successfully'
                              )
                            )
                            setTimeout(() => {
                              dispatch(hideToast())
                            }, 3500)
                          }}
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={2} className='text-center my-auto'>
                        <i
                          className='fas fa-trash mt-4-sm'
                          onClick={() =>
                            removeFromCartHandler(item.product, item.qty)
                          }
                        ></i>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Col>
        <Col md={4}>
          <Card style={{ border: 'none' }}>
            <ListGroup
              variant='flush'
              style={{
                position: 'absolute',
                top: '73px',
                width: '100%',
                textAlign: 'center',
              }}
            >
              {cartItems.length > 0 && (
                <>
                  <ListGroup.Item>
                    <h2 className='my-auto'>
                    Subtotal:{' '}
                      {cartItems.reduce(
                        (acc, item) => acc + Number(item.qty),
                        0
                      )}{' '}
                      products
                    </h2>
                    <h1 style={{ color: '#AAAAAA' }}>
                      {cartItems
                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                        .toLocaleString('en-US')}{' '}
                      $
                    </h1>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn-block btn-brand'
                      onClick={checkoutHandler}
                    >
                      to the next step
                    </Button>
                  </ListGroup.Item>
                </>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CartScreen
