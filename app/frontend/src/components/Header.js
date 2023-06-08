import { useSelector, useDispatch } from 'react-redux'
import { Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import logo from '../images/logo.png'
import CartToast from './CartToast'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'

const Header = () => {
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems, toast } = cart

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      <Navbar bg='primary' className='navbar-dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand className='mr-n4'>
              <Navbar.Brand>
                <img src={logo} alt='logo' className='logo-img' />
              </Navbar.Brand>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Route render={({ history }) => <SearchBox history={history} />} />
            <Nav className='mr-auto'>
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title={`Administrator menu `} id='adminmenu'>
                  <LinkContainer to='/admin/orders'>
                    <NavDropdown.Item>List of orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/products'>
                    <NavDropdown.Item>List of products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/users'>
                    <NavDropdown.Item>User list</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Personal area</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {userInfo && !userInfo.isAdmin ? (
                <NavDropdown title={`${userInfo.name}  `} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>My profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                !userInfo && (
                  <LinkContainer to='/login'>
                    <Nav.Link>
                      <i className='fas fa-user'></i> Login and registration
                    </Nav.Link>
                  </LinkContainer>
                )
              )}
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <i className='fas fa-shopping-cart'></i> Shopping Cart{' '}
                  {cartItems.length > 0 &&
                    `(${cartItems.reduce(
                      (acc, item) => acc + Number(item.qty),
                      0
                    )})`}
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>{' '}
          {toast && <CartToast />}
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
