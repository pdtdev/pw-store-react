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
                        logged_in = {this.props.logged_in}
                        openModal = {this.props.openModal}
                        password_items = {this.props.password_items}
                    />
                    <TblFooterPasswords />
                </Table>
            </React.Fragment>
        )
    }
}

export default TblPasswords;