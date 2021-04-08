
import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'


class LoginUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password : ''
        }
    }
    handlePasswordChange = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    render() {
        return (
            <Container>
                <form onSubmit={e => this.props.handleLogin(e, {
                    username : this.props.username, 
                    password : this.state.password
                })} >
                    <Row className="form-group">
                        <label htmlFor="username" >Username</label>
                        <input type="text"
                        onChange={this.props.handleLoginChange} 
                        value={this.props.username} 
                        name="username"
                        id="username"
                        placeholder="Username" />
                    </Row>
                    <Row className="form-group">
                        <label htmlFor="password" >Password</label>
                        <input type="password"
                        onChange={this.handlePasswordChange} 
                        value={this.state.password} 
                        name="password"
                        id="password"
                        placeholder="Password" />
                    </Row>
                    <button type='submit' className="btn btn-primary">Login</button>
                </form>
            </Container>
        )
    }
}

export default LoginUser