import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
// import paginationFactory from 'react-bootstrap-table2-paginator';
// import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
// import filterFactory from 'react-bootstrap-table2-filter';
// import Axios from 'axios';
// import { Container, Row, Col, Button } from 'react-bootstrap';

import { DateTime } from "luxon";
import Container  from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Col } from 'react-bootstrap';

// const base_url = window.SERVER_ADDRESS
const DATETIME_FORMAT = 'd MMM yyyy HH:mm'

export default class ContactsTable extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            expanded: [],
            item: [],
            selected: [],
            hoverIdx: null,
            alertText: [],
            alertVariant: 'info',
        };
    }

    columns = [{
        dataField: 'first_name',
        text: 'Given Name',
        // title: titleTitle,
        // formatter: titleFormatter,
        // sort: true,
        // filter: textFilter()
        }, {
        dataField: 'last_name',
        text: 'Surname',
        // sort: true,
        // filter: textFilter()
        }, 
        {
        dataField: 'cell1',
        text: 'Cell Phone 1',
        // sort: true,
        // filter: textFilter()
        }, 
        {
        dataField: 'update_time',
        text: 'Update Time',
        formatter: (cell) => {
            return DateTime.fromISO(cell).toFormat(DATETIME_FORMAT);
        },
        // sort: true,
        // filter: dateFilter()
    }];

    render() {
        const expandRow = {
            renderer: row => (
                <Container>
                    <Row>
                        <Col><b>Email: </b>{row.email}</Col>
                        {/* <Col></Col> */}
                        <Col><b>Comment: </b>{row.comment}</Col>
                        {/* <Col></Col> */}
                    </Row>
                {row.companies.length > 0 ?
                    <Row><b>Companies</b></Row>
                    : null    
                }
                {row.companies.map(item => (
                    <React.Fragment key={item.id}>
                        <Row>
                            <Col>
                            {item.name}
                            </Col>
                            <Col>
                            {item.business_phone1}
                            </Col>
                        </Row>
                    </React.Fragment>
                ))}
                
                </Container>
            ),
            showExpandColumn: true,
            onlyOneExpanding: true,
        }
        return(
            <BootstrapTable 
                bootstrap4
                keyField="id" 
                data={ this.props.contacts } 
                columns={ this.columns } 
                expandRow={expandRow}
                striped
                hover
                condensed
            />
        )
    }
}