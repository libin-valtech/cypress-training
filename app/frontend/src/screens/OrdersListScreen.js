import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import NumberFormat from 'react-number-format'
import { Helmet } from 'react-helmet'
import Message from '../components/Message'
import Spinner from '../components/layout/Spinner'
import { getAllOrders, deleteOrder } from '../actions/orderActions'
import { ORDER_DELIVERED_RESET } from '../constants/orderConstants'

const OrdersListScreen = ({ history }) => {
  const [successDelivered, setSuccessDelivered] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const ordersList = useSelector((state) => state.ordersList)
  const { loading, error, orders, message } = ordersList

  const orderDelivered = useSelector((state) => state.orderDelivered)
  const { loading: loadingDeliver, success: successDeliver } = orderDelivered

  const orderDelete = useSelector((state) => state.orderDelete)
  const { loading: loadingDelete, error: deleteError } = orderDelete

  useEffect(() => {
    if (!userInfo || (userInfo && !userInfo.isAdmin)) {
      history.push('/')
      return
    }

    if (!loading && !loadingDeliver && successDeliver) {
      setSuccessDelivered(true)
      setTimeout(() => {
        setSuccessDelivered(false)
        dispatch({ type: ORDER_DELIVERED_RESET })
      }, 2000)
    }

    dispatch(getAllOrders())

    // eslint-disable-next-line
  }, [dispatch, userInfo, history, loadingDeliver, successDeliver])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete the order?')) {
      dispatch(deleteOrder(id, userInfo._id))
    }
  }

  return (
    <>
      <Helmet>
      <title>Order list</title>
      </Helmet>
      <h1 style={{ color: '#AAAAAA' }}>Order list</h1>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {message && (
            <Message
              variant='success'
              dismissible={false}
              classN='alert-product-screen'
            >
              {message}
            </Message>
          )}

          {deleteError && (
            <Message
              variant='danger'
              dismissible={true}
              classN='alert-product-screen'
            >
              {deleteError}
            </Message>
          )}

          {error ? (
            <Message variant='danger' dismissible={false}>
              {error}
            </Message>
          ) : successDelivered ? (
            <Message
              variant='success'
              dismissible={false}
              classN='alert-product-screen'
            >
The order has been marked as sent successfully            </Message>
          ) : loadingDelete ? (
            <Spinner />
          ) : (
            <Table
              striped
              bordered
              hover
              responsive
              className='table-sm'
              style={{ color: '#AAAAAA' }}
            >
             <thead>
                 <tr style={{ textAlign: 'center' }}>
                   <th style={{ width: '7rem' }}>order number</th>
                   <th style={{ width: '8rem' }}>order date</th>
                   <th style={{ width: '8rem' }}>customer name</th>
                   <th
                     style={{ textAlign: 'right', width: '18rem' }}
                     className='hide-sm'
                   >
                     Customer address
                   </th>
                   <th className='hide-sm hide-md'>Products on order</th>
                   <th>Payment Status</th>
                   <th className='hide-sm'>payment date</th>
                   <th>shipping status</th>
                   <th className='hide-sm'>sent on</th>
                   <th>Amount of the order</th>
                   <th className='hide-sm hide-md'>delete</th>
                 </tr>
               </thead>
              <tbody>
                 {!loading &&
                   orders.map((order) => (
                     <tr key={order._id}>
                       <td
                         onClick={() => history.push(`/order/${order._id}`)}
                         className='order-link'
                       >
                         <span title='Beyond the order details'>
                           {order._id.slice(17, 24)}
                         </span>
                       </td>

                       <td
                         onClick={() => history.push(`/order/${order._id}`)}
                         className='order-link'
                       >
                         <span title='Beyond the order details'>
                           {new Date(
                             order.createdAt.substring(0, 10)
                           ).toLocaleDateString('en-US')}
                         </span>
                       </td>
                       <td
                         onClick={() => history.push(`/order/${order._id}`)}
                         className='order-link'
                       >
                         <span title='Go to order details'>{order.user.name}</span>
                       </td>
                       <td
                         onClick={() => history.push(`/order/${order._id}`)}
                         className='order-link text-right hide-sm'
                       >
                         <span title='Beyond the order details'>
                           {order.shippingAddress.address}{' '}
                           {order.shippingAddress.city}
                         </span>
                       </td>
                       <td
                         onClick={() => history.push(`/order/${order._id}`)}
                         className='order-link hide-sm hide-md'
                       >
                         <span title='Beyond the order details'>
                           {order.orderItems.length}
                         </span>
                       </td>
                       <td
                         onClick={() =>
                           history.push(`/admin/user/${order.user._id}/edit`)
                         }
                         className='order-link'
                       >
                         <span title='Beyond the order details'>
                           {order.isPaid ? (
                             <i
                               className='fas fa-check'
                               style={{ color: '#3fa63f' }}
                             ></i>
                           ) : (
                             <i
                               className='fas fa-times'
                               style={{
                                 color: '#e9352f',
                               }}
                             ></i>
                           )}
                         </span>
                       </td>

                       <td
                         onClick={() => history.push(`/order/${order._id}`)}
                         className='hide-sm'
                       >
                         <span title='Beyond the order details'>
                           {order.isPaid
                             ? new Date(
                                 order.paidAt.substring(0, 10)
                               ).toLocaleDateString('en-US')
                             : ''}
                         </span>
                       </td>

                       <td
                         onClick={() =>
                           history.push(`/admin/user/${order.user._id}/edit`)
                         }
                         className='order-link'
                       >
                         <span title='Beyond the order details'>
                           {order.isDelivered ? (
                             <i
                               className='fas fa-check'
                               style={{ color: '#3fa63f' }}
                             ></i>
                           ) : (
                             <i
                               className='fas fa-times'
                               style={{
                                 color: '#e9352f',
                               }}
                             ></i>
                           )}
                         </span>
                       </td>
                       <td
                         onClick={() => history.push(`/order/${order._id}`)}
                         className='hide-sm'
                       >
                         <span title='Beyond the order details'>
                           {order.isDelivered
                             ? new Date(
                                 order.deliveredAt.substring(0, 10)
                               ).toLocaleDateString('en-US')
                             : ''}
                         </span>
                       </td>

                       <td
                         onClick={() => history.push(`/order/${order._id}`)}
                         className='order-link'>
                         <span title='Beyond the order details'>
                           <NumberFormat
                             value={order.totalPrice}
                             displayType={'text'}
                             thousandSeparator={true}
                           />
                         </span>
                       </td>
                       <td
                         style={{ textAlign: 'center' }}
                         className='hide-sm hide-md'
                       >
                         {!order.isPaid ? (
                           <i
                             className='fas fa-trash-alt'
                             style={{
                               color: '#e9352f',
                               cursor: 'pointer',
                             }}
                             onClick={() => deleteHandler(order._id)}
                           ></i>
                         ) : (
                           <span title='Unable to delete a paid order'>
                             <i
                               className='fas fa-trash-alt'
                               style={{
                                 color: '#AAAAAA',
                                 cursor: 'not-allowed',
                               }}
                             ></i>
                           </span>
                         )}
                       </td>
                     </tr>
                   ))}
               </tbody>
            </Table>
          )}
        </>
      )}
    </>
  )
}

export default OrdersListScreen
