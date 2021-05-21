import React, { Component } from 'react'
import LoginUser from './Accounts/LoginUser';
import RegisterUser from './Accounts/RegisterUser';
import ListGroup from 'react-bootstrap/ListGroup'

class NavComponent extends Component {
    
    render(){
        let form;
        switch(this.props.displayed_form){
            case 'login' : 
                form = <LoginUser
                        handleLoginChange={this.props.handleLoginChange}
                        handleLogin={this.props.handleLogin}
                        username={this.props.username}
                        />;
                break;
            case 'signup' : 
                form = <RegisterUser 
                display_form={this.props.display_form}/>
                break;
            default:
                form = null;
            }
        const logged_in_nav = (
            <ListGroup>
                <ListGroup.Item as="button" action 
                variant={this.props.displayed_form === 'login' ? "primary" : "secondary"} 
                onClick= {() => this.props.display_form('login')}>
                    Login
                </ListGroup.Item>
                <ListGroup.Item as="button" action 
                variant={this.props.displayed_form === 'signup' ? "primary" : "secondary"} 
                onClick= {() => this.props.display_form('signup')}>
                    Signup
                </ListGroup.Item>
            </ListGroup>
        );
        const logged_out_nav = (
            <ListGroup>
                <ListGroup.Item as="button" action variant="success" onClick={this.props.handleLogout}>Logout</ListGroup.Item>
            </ListGroup>
        );
        return (
            <div>
                {this.props.logged_in ? logged_out_nav : logged_in_nav}
                {form}            
            </div>
        );
    }
}
export default NavComponent
