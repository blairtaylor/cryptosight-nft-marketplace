import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import logo from './cryptosight-mp-logo.png'

const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar className="custom-navbar" expand="lg" bg="light" variant="light">
            <Container>
                <Navbar.Brand href="http://www.cryptosight.ca">
                    <img src={logo} width="384" height="44" className="" alt="" />
                    &nbsp;
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto" variant="pills">
                        <Nav.Link className="nav-links" as={Link} to="/">Home</Nav.Link>
                        <Nav.Link className="nav-links" as={Link} to="/create">Add an Item</Nav.Link>
                        <Nav.Link className="nav-links" as={Link} to="/my-listed-items">My Items For Sale</Nav.Link>
                        <Nav.Link className="nav-links" as={Link} to="/my-purchases">My Purchases</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button className="custom-btn" variant="outline-light">
                                   Account: {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light" className="custom-btn">Connect to your MetaMask Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;