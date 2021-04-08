
import React, { Component } from 'react'
import Axios from 'axios';
import Form from 'react-bootstrap/Form';
import {Row, Col} from 'react-bootstrap';
import Alert  from 'react-bootstrap/Alert';
import PasswordField from "../PasswordField";
import Button from 'react-bootstrap/Button';
const required = (val) => val && val.length;
const minLength = (len, val) => !(val) || (val.length < len);
const maxLength = (len, val) => (val.length > len);
const isEqual = (p1, p2) => p1 === p2;

const base_url = window.SERVER_ADDRESS

class RegisterUser extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            first_name : '',
            last_name : '',
            username : '',
            email: '',
            password : '',
            password2 : '',
            error : {
                first_name : ['This value is required'],
                last_name : ['This value is required'],
                username : ['This value is required'],
                email: [''],
                password : ['This value is required'],
                password2 : ['This value is required'],
            },
            isError : {
                first_name : true,
                last_name : true,
                username : true,
                email: false,
                password : true,
                password2 : true,
            },
            complete: false,
        }

    }
    
    isValid = () => {
        let valid = true;
        Object.values(this.state.isError).forEach((val) => {
                if(val === true){
                    valid = false
                    return valid
                }
        })
        return valid;
    }

    clearForm = () => {
        this.setState({
                first_name : '',
                last_name : '',
                username : '',
                email : '',
                password : '',
                password2 : '',
                error : {
                    first_name : ['This value is required'],
                    last_name : ['This value is required'],
                    username : ['This value is required'],
                    email : '',
                    password : ['This value is required'],
                    password2 : ['This value is required'],
                },
                isError : {
                    first_name : true,
                    last_name : true,
                    username : true,
                    email : '',
                    password : true,
                    password2 : true,
                },
                complete: false,
        })
    }
    sendRegistration = e => {
        let msgs;
        e.preventDefault()
        const {first_name, last_name, username, email, password, } = this.state
        let newState = Object.assign({}, this.state) 
        if(this.isValid()){
            Axios.post(base_url + 'api/v3/users/create/', {
                'user' : {
                    'first_name' : first_name,
                    'last_name' : last_name,
                    'username' :  username,
                    'email' : email,
                    'password' : password
                }})
            .then(response => {
                if (response.status === 200) {
                    if(response.data.response === 'success') {
                        console.debug(response.data.message)
                        console.debug(response.data.user)
                        this.setState({
                            first_name: response.data.user.first_name,
                            last_name: response.data.user.last_name,
                            username: response.data.user.username,
                            complete: true,
                        })
                        //this.clearForm()
                    }
                    if(response.data.response === 'error') {
                        console.debug("Registration issue")
                        console.debug(response.data.message)
                        msgs = Object.keys(response.data.message)
                        msgs.forEach((key) => {
                            newState['isError'][key] = true
                            newState['error'][key] = response.data.message[key]
                        })
                        this.setState(newState)
                    }
                }
            })
            .catch(error => {
                if(error.response) {
                    console.debug(error.response)
                }
            })
        }
        else {
            // Alert
        }
    }
    
    changeHandler = (event) => {
        event.preventDefault()
        let { name, value } = event.target;
        
        let newState = Object.assign({}, this.state) 
        let errors = [];
        if (name !== 'email') {
            if(!required(value)){
                errors.push('This value is required')
            }
            if(minLength(3, value)){
                errors.push('Three or greater characters required')
            }
            if(maxLength(25, value)){
                errors.push('Cannot be more than 25 characters')
            }
            if(name === 'password2' && !isEqual(this.state.password, value)){
                errors.push('Passwords should be the same')
            }    
        }
                
        var stateObject = function() {
        
            var returnObj = newState;
            
            if(errors.length === 0) {
                returnObj['isError'][name] = false;
            }
            else {
                returnObj['isError'][name] = true;
                returnObj['error'][name] = errors;
            }
            return returnObj;
        }();
        
        this.setState(stateObject)
        this.setState({
            [name] : value,
        })
    }
    
    closeFinished = () => {
        this.setState({complete: false})
        this.clearForm()
    }

    render() {
        return (
            <Form onSubmit={this.sendRegistration} noValidate>
                <Form.Group>
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        name="first_name"
                        type="text"
                        value={this.state.first_name} 
                        onChange={this.changeHandler}
                    ></Form.Control>
                    <Form.Text>
                        <RegisterAlert 
                        show={this.state.isError.first_name} 
                        error={this.state.error.first_name}
                        />
                    </Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        name="last_name"
                        type="text"
                        value={this.state.last_name} 
                        onChange={this.changeHandler}
                    ></Form.Control>
                    <Form.Text>
                        <RegisterAlert 
                        show={this.state.isError.last_name} 
                        error={this.state.error.last_name}
                        />
                    </Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>User name</Form.Label>
                    <Form.Control
                        name="username"
                        type="text"
                        value={this.state.username} 
                        onChange={this.changeHandler}
                        autoComplete="new-username"
                    ></Form.Control>
                    <Form.Text>
                        <RegisterAlert 
                        show={this.state.isError.username} 
                        error={this.state.error.username}
                        />
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        name="email"
                        type="text"
                        value={this.state.email} 
                        onChange={this.changeHandler}
                        autoComplete="new-email"
                    ></Form.Control>
                    <Form.Text>
                        <RegisterAlert 
                        show={this.state.isError.email} 
                        error={this.state.error.email}
                        />
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <PasswordField
                        name="password"   
                        value={this.state.password} 
                        onChange={this.changeHandler}
                        autoComplete="new-password"
                    />
                    <Form.Text>
                        <RegisterAlert 
                        show={this.state.isError.password} 
                        error={this.state.error.password}
                        />
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password again</Form.Label>
                    <Form.Control
                        name="password2"   
                        type="password"
                        value={this.state.password2} 
                        onChange={this.changeHandler}
                    />
                    <Form.Text>
                        <RegisterAlert 
                        show={this.state.isError.password2} 
                        error={this.state.error.password2}
                        />
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">Register</Button>
                <Alert variant="success" show={this.state.complete}>
                    <Alert.Heading>Registration Complete</Alert.Heading>
                    <Row>
                        <Col>First name:</Col>
                        <Col>{this.state.first_name}</Col>
                    </Row>
                    <Row>
                        <Col>Last name:</Col>
                        <Col>{this.state.last_name}</Col>
                    </Row>
                    <Row>
                        <Col>Username:</Col>
                        <Col>{this.state.username}</Col>
                    </Row>
                    <Row>
                        <Col>Email:</Col>
                        <Col>{this.state.email}</Col>
                    </Row>
                    <Button variant="success" onClick={this.closeFinished}>Finished Registration</Button>
                </Alert>
            </Form>

        )
    }
}

class RegisterAlert extends Component {

    render() {
        return(
            <Alert variant="warning" show={this.props.show}>
            {this.props.error.map((error, index) => <Row key={index} style={{color : 'red'}}>
                {error}
            </Row>)}
        </Alert>
        )
    }
}

export default RegisterUser