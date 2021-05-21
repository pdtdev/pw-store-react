import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import TblHeadPasswords from "./TableHeadPasswords";
import TblBodyPasswords from "./TableBodyPasswords";
import TblFooterPasswords from "./TableFooterPasswords";

class TblPasswords extends Component {

    render() {
        
        return(
            <React.Fragment>
                <Table striped bordered hover size="sm">
                    <TblHeadPasswords />
                    <TblBodyPasswords 
                        password_items = {this.props.password_items}
                        logged_in = {this.props.logged_in}
                        isOpen = {this.props.isOpen}
                        openModal = {this.props.openModal}
                        activeItem={this.props.activeItem}
                        isPasswordShow = {this.props.isPasswordShow}
                        showPassword = {this.props.showPassword}
                        showPasswordClose = {this.props.showPasswordClose}
                    />
                    <TblFooterPasswords />
                </Table>
            </React.Fragment>
        )
    }
}

export default TblPasswords;