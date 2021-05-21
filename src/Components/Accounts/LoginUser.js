
import React, { Component } from 'react'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
// import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class LoginUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password : ''
        }

        this.handlePasswordChange = this.handlePasswordChange.bind(this)
    }
    handlePasswordChange = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    render() {
        return (
                <Form onSubmit={(e) => this.props.handleLogin(e, {
                    username : this.props.username, 
                    password : this.state.password
                    })}
                    >
                        <Container>
                            <Form.Group>
                            <Row>
                            <Col xs={3}>
                                <Form.Label>User name</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                onChange={this.props.handleLoginChange} 
                                value={this.props.username} 
                                name="username"
                                placeholder="apple-spice32"
                                autoComplete="username"
                                ></Form.Control>
                            </Col>
                            </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col xs={3}>
                                    <Form.Label>Password</Form.Label>
                                    </Col>
                                    <Col>
                                    <Form.Control
                                    type="password"
                                    onChange={this.handlePasswordChange} 
                                    value={this.state.password} 
                                    name="password"
                                    placeholder="secret password"
                                    autoComplete="current-password"
                                    ></Form.Control>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Row>
                                <Col xs={3}>Click login to continue...</Col>
                                <Col><Button type="submit" variant="primary">Login</Button></Col>
                            </Row>
                        </Container>
                    
                </Form>
        )
    }
}

export default LoginUser