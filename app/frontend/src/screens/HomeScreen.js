import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import Product from '../components/Product'
import { listProducts } from '../actions/productActions'
import Spinner from '../components/layout/Spinner'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'

const HomeScreen = ({ match, history }) => {
  const keyword = match.params.keyword

  const pageNumber = match.params.pagenumber || 1

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { toast } = cart

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, pages, page } = productList

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))

    if (toast) {
      window.scrollTo(0, 0)
    }
  }, [dispatch, keyword, pageNumber, toast])

  return (
    <>
      <Helmet>
        <title>Shop</title>
      </Helmet>
      {!keyword && (
        <>
          <ListGroup>
            <ListGroup.Item className='pb-5 list-group-home list-group-home-md list-group-home-sm hide-sm'>
              <h1 className='mr-5' style={{ color: '#53dbb2' }}>
              The hot products
              </h1>
              <ProductCarousel />
            </ListGroup.Item>
          </ListGroup>
          <h3 className='mb-n3 mt-4' style={{ color: '#53dbb2' }}>
          All products
          </h3>
        </>
      )}
      {loading ? (
        <Spinner />
      ) : error ? (
        <Message variant='danger' dismissible={false}>
          {error}
        </Message>
      ) : (
        <>
          {keyword && products.length > 0 && (
            <>
              <Button onClick={() => history.goBack()}>return</Button>

              <h3>Search results for "{keyword}"</h3>
            </>
          )}
          <Row>
            {products.length > 0 ? (
              products
                .filter((product) => product.published)
                .map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} history={history} />
                  </Col>
                ))
            ) : (
              <>
                <h3 className='mr-3'>
                No products found.{' '}
                  <span
                    style={{ color: '#AAAAAA' }}
                    className='link'
                    onClick={() => history.push('/')}
                  >
return                  </span>
                </h3>
              </>
            )}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  )
}

export default HomeScreen
