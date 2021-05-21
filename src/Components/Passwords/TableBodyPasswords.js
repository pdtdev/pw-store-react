import React, { Component } from 'react'
import { DateTime } from "luxon";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row"
// import PasswordField from '../PasswordField';
// import { NavItem } from 'react-bootstrap';

const DATETIME_FORMAT = 'd MMM yyyy HH:mm'

class TblBodyPasswords extends Component {

    // showHideBtn = (item) => {
    //     if (!this.props.isPasswordShow) {
    //         this.props.showPassword(item)
    //     } else {
    //         this.props.showPasswordClose()
    //     }
    // }

    render() {

        return(
            <React.Fragment>
                <tbody>
                    {this.props.password_items.map(item => (
                        <React.Fragment key={item.id}>
                        <tr title={item.url}>
                            <td onClick={(e) => this.props.openModal(e, item)} >
                                {item.title}
                            </td>
                            <td>
                                {item.username}
                            </td>
                            <td>
                                { DateTime.fromISO(item.update_time).toFormat(DATETIME_FORMAT) }
                            </td>
                            <td>
                                <ButtonShow
                                    showPassword = {this.props.showPassword}
                                    showPasswordClose = {this.props.showPasswordClose}
                                    isPasswordShow = {this.props.isPasswordShow}
                                    activeItem = {this.props.activeItem}
                                    item = {item}
                                />
                                <PasswordShow 
                                    isPasswordShow = {this.props.isPasswordShow}
                                    showPasswordClose = {this.props.showPasswordClose}
                                    activeItem = {this.props.activeItem}
                                    item = {item}
                                />
                            </td>
                            <td>
                                <Button 
                                    onClick={(e) => this.props.openModal(e, item)}
                                    active={this.props.isOpen && item.id === this.props.activeItem.id}
                                >
                                    Open
                                </Button>
                            </td>
                        </tr>
                        
                        </React.Fragment>
                    ))
                    }
                </tbody>
            </React.Fragment>
        )
    }
}

class ButtonShow extends Component {

    state = {
        button_text: 'Show',
        button_variant: 'info',
    };

    showHide = (e, item) => {
        e.preventDefault()
        
        if (!this.props.isPasswordShow) {
            this.props.showPassword(item)
        } else {
            this.props.showPasswordClose()
        }

        this.setState({
            button_text: this.props.isPasswordShow ? 'Show' : 'Hide',
            button_variant: this.props.isPasswordShow ? 'info' : 'warning',
        });
    }

    render() {
        return (
            <Button 
                onClick={(e) => this.showHide(e, this.props.item)} 
                active={this.props.isPasswordShow && this.props.item.id === this.props.activeItem.id}
                variant={this.state.button_variant}
            >
            {this.state.button_text}
            </Button>
        )
    }
}

class PasswordShow extends Component {
    render() {
        return(
            <React.Fragment>
                {this.props.activeItem.id === this.props.item.id ? 
                <Alert key={this.props.activeItem.id} show={this.props.isPasswordShow} 
                variant="info">
                <Row key={this.props.activeItem.id}>
                    {this.props.activeItem.password}
                </Row>
                </Alert> : null}
            </React.Fragment>
        )
    }
}


export default TblBodyPasswords;