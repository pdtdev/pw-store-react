// TODO Custom Table 2

import React, { Component } from 'react'
import CustomTable2 from '../CustomTable2'
// import PasswordField from '../PasswordField'
import { DateTime } from "luxon";
// import Button from 'react-bootstrap/Button';
import { textFilter, dateFilter } from 'react-bootstrap-table2-filter';

const DATETIME_FORMAT = 'd MMM yyyy HH:mm'

function titleFormatter(cell, row, rowIndex, formatExtraData) {
    
    if (!row.url.startsWith('http') || row.url === '') {
        return (
            `${cell}`
        ); 
    }
    else {
        return (
            <a href={row.url} onClick={(e) => {e.preventDefault(); e.stopPropagation()}}>{cell}</a>
        )
    }
    
}

function titleTitle(cell, row, rowIndex, colIndex) {
    if (row.url === '') {
        return(
            `${cell} [${row.username}]`
            )
    }
    else {
        return(
            `${cell} [${row.username}] (${row.url})`
            )
        }
    }

const columns = [{
    dataField: 'title',
    text: 'Title',
    title: titleTitle,
    formatter: titleFormatter,
    sort: true,
    filter: textFilter()
    }, {
    dataField: 'username',
    text: 'User Name',
    sort: true,
    filter: textFilter()
    }, 
    // {
    // dataField: 'url',
    // text: 'Link',
    // sort: true,
    // filter: textFilter()
    // }, 
    {
    dataField: 'update_time',
    text: 'Update Time',
    formatter: (cell) => {
        return DateTime.fromISO(cell).toFormat(DATETIME_FORMAT);
    },
    sort: true,
    filter: dateFilter()
}];

const defaultSorted = [{
    dataField: 'title',
    order: 'asc'
}];


class Tbl2PasswordsCustom extends Component  {

    /**
        columns = React.useMemo(
        () => [
        {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
            // Use Cell to render an expander for each row.
            // We can use the getToggleRowExpandedProps prop-getter
            // to build the expander.
            <>
            <span {...row.getToggleRowExpandedProps()} title={row.isExpanded ? 'Hide Password' : 'Show Password'}>
            {row.isExpanded ? '[ - ]' : '[ + ]'}
            </span>
            <span title='Edit Password'>
            <Button 
                    key={row.id}
                    variant="link"
                    onClick={(e) => openModal(e, row.original)}
                >
                Edit
                </Button>
            </span>
            </>
        ),
        },        
        {
        Header: 'Password',
        columns: [
            {
            Header: 'Title',
            accessor: 'title',
            Cell: TitleFmtCell,
            },
            {
            Header: 'User Name',
            accessor: 'username',
            },
            // {
            // Header: 'Link',
            // accessor: 'url',
            // Cell: UrlFmtCell,
            // },
        ],
        },
        {
        Header: 'Access',
        columns: [
            {
            Header: 'Update Time',
            accessor: 'update_time',
            Cell: DateTimeFmtCell,
            },
            
        ],
        },
    ],
    [openModal]
    )
    // const [data, setData] = React.useState(data_items)
    // const [originalData] = React.useState(data)
    const [skipPageReset, setSkipPageReset] = React.useState(false)
    
     */
    
    render() {
        return(
            <>
                <CustomTable2
                    columns={columns}
                    data={this.props.data}
                    defaultSorted={defaultSorted}
                    logout = {this.props.logout}
                    openEdit = {this.props.openEdit}
                    showAlert={this.props.showAlert}
                    closeAlert={this.props.closeAlert}
                    selected = {this.props.selected}
                    handleOnSelect = {this.props.handleOnSelect}
                    handleOnSelectAll = {this.props.handleOnSelectAll}
                    passwordsEditBtnVariant = {this.props.passwordsEditBtnVariant}
                    passwordsDelBtnVariant = {this.props.passwordsDelBtnVariant}
                    passwordsCopyBtnVariant = {this.props.passwordsCopyBtnVariant}
                />
            </>
        )
    }
}

export default Tbl2PasswordsCustom;