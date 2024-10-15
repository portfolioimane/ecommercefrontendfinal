import React from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap'; // Import Navbar and Nav
import Sidebar from './Sidebar'; 
import './DashboardLayout.css'; // Ensure this path is correct
import { Outlet, useNavigate } from 'react-router-dom'; // Import Outlet and useNavigate
import { useDispatch } from 'react-redux'; // Import useDispatch
import { logout } from '../../redux/authSlice'; // Adjust the path to where your authSlice is located
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome
import { faEye, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import specific icons

const DashboardLayout = ({ newOrderCount }) => {
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch(); // Hook for dispatching actions

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action to update the Redux state
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <Container fluid>
      <Row style={{ height: '100vh' }}>
        <Col xs={2} className="sidebar-col">
          <Sidebar />
        </Col>
        <Col xs={10} className="content-col">
          {/* Navbar at the top of the content area */}
          <Navbar className="transparent-navbar" expand="lg" style={{ marginLeft: 0 }}>
            <Container fluid>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="/" style={{ color: 'grey' }}>
                    <FontAwesomeIcon icon={faEye} style={{ marginRight: '5px' }} /> {/* View Site Icon */}
                    View Site
                  </Nav.Link> {/* Link to view the site */}
                </Nav>
                <Nav>
                  <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer', color: 'grey' }}>
                    <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '5px' }} /> {/* Logout Icon */}
                    Logout
                  </Nav.Link> {/* Logout action */}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <div class="container">
          {/* Render nested routes */}
          <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;
