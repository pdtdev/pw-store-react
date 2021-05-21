import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
// import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filterFactory from 'react-bootstrap-table2-filter';
import Axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';

const base_url = window.SERVER_ADDRESS

// TODO implement with react-bootstrap-table2
/**
 * - column ordering
 * - column filtering
 * - row expand to show/copy 'password'
 * - edit cell OR modal to form edit
 * 
 */

// const { SearchBar, ClearSearchButton } = Search;

class CustomTable2 extends Component {
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

    timerAlert = null

    componentDidMount = () => {

    }

    // PAGINATION //
    customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
            Showing { from } to { to } of { size } Results
        </span>
    );
    // PAGINATION options 
    options = {
        paginationSize: 5,
        pageStartIndex: 1,
        // alwaysShowAllBtns: true, // Always show next and previous button
        // withFirstAndLast: false, // Hide the going to First and Last page button
        hideSizePerPage: false, // Hide the sizePerPage dropdown always
        hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
        firstPageText: ' << ',
        prePageText: ' < ',
        nextPageText: ' > ',
        lastPageText: ' >> ',
        nextPageTitle: 'Next page',
        prePageTitle: 'Prev page',
        firstPageTitle: 'First page',
        lastPageTitle: 'Last page',
        showTotal: true,
        paginationTotalRenderer: this.customTotal,
        disablePageTitle: false,
        sizePerPageList: [{
            text: '5', value: 5
        }, {
            text: '10', value: 10
        }, {
            text: '15', value: 15
        }, {
            text: 'All', value: this.props.data.length
        }] // A numeric array is also available. the purpose of above example is custom the text
    };

    // SEARCH   Implement startWith instead of contain 
    // customMatchFunc = ({
    //     searchText,
    //     value,
    //     column,
    //     row
    //     }) => {
    //     if (typeof value !== 'undefined') {
    //         return value.startsWith(searchText);
    //     }
    //     return false;
    // }
    
    // ROW EXPANDER //
    handleOnExpand = (row, isExpand, rowIndex, e) => {
        
        if (isExpand) {
            if (row.id) {
                const id = row.id
                Axios.get(base_url + `passwords/api/v3/${id}/`, {
                    headers : {
                        Authorization : `Token ${localStorage.getItem('token')}`
                    }
                })
                .then(response => {
                    this.setState(() => ({
                        expanded: [...this.state.expanded, row.id],
                        item: [...this.state.item, response.data]
                    }));
                    
                    // return response.data;
                })
                .catch(error => {
                    if(error.response) {
                        if(error.response.status === 401) {
                            // TODO Fire alert this.props.showAlert()
                            console.debug("Token - Auth Failed")
                            console.debug(error.response.data.detail)
                            this.props.showAlert('expand', [error.response.data.detail, '. Log out in 3 secs.'], 'warning')
                            this.timerAlert = setTimeout(() => {
                                this.props.logout();
                                this.props.closeAlert();
                                clearTimeout(this.timerAlert);
                            }, 3000);
                        }
                        else if(error.response.status === 403) {
                            console.debug("Forbidden")
                        }
                        else if(error.response.status === 404) {
                            console.debug("Not Found")
                        }
                    }
                });
            }
            else{
                console.error("TableRowSub : No 'row' or 'row.id' parsed!")
            }
        } else {
            this.setState(() => ({
                expanded: this.state.expanded.filter(x => x !== row.id),
                item: this.state.item.filter(x => x.id !== row.id)
            }));
        }
    }

        
    handleOnExpandAll = (isExpandAll, rows, e) => {
        
        e.preventDefault()

        const ids = rows.map(r => r.id);
        console.debug(ids)
        let api_calls = []
        if(isExpandAll) {

            ids.forEach(id => (
                api_calls.push(
                    Axios.get(base_url + `passwords/api/v3/${id}/`, {
                        headers : {
                            Authorization : `Token ${localStorage.getItem('token')}`
                        }
                    }))
            ));
            Promise.all(api_calls).then(results => {

                this.setState(() => ({
                    expanded: [...this.state.expanded, ids],
                    // item: [...this.state.item, results.map(res => res.data)]
                }));
                
            });

            console.debug(this.state.item)
            console.debug(this.state.expanded)

        } else {
            
            ids.map(id => (
                this.setState(() => ({
                    expanded: this.state.expanded.filter(r => r !== id)
                }))
            ))
        }
    }
    
    // handleOnSelect = (row, isSelect) => {
    //     if (isSelect) {
    //         this.setState(() => ({
    //         selected: [...this.state.selected, row.id]
    //         }));
    //     } else {
    //         this.setState(() => ({
    //         selected: this.state.selected.filter(x => x !== row.id)
    //         }));
    //     }
    // }
    
    // selectRow = {
    //     mode: 'checkbox',
    //     clickToSelect: true,
    //     clickToExpand: false,
    //     classes: 'selection-row'
    // };
    
    handleEditBtnClick = (e) => {
        e.preventDefault()
        console.debug("Edit Selected")
        console.debug(this.props.selected)

        let text = ''
        let variant = 'disabled'
        const sel_cnt = this.props.selected.length
        
        if(sel_cnt > 0) {
            const row = {id: this.props.selected[0]}
            text += sel_cnt

            if(sel_cnt === 1) {
                variant = 'warning'
                text += ' entry.'
            }
            else {
                variant = 'danger'
                text += ' entries. ONLY editing first selected.'
            }
            this.props.showAlert('edit', ['Editing: ' + text], variant, false, true, variant)
            
            this.timerAlert = setTimeout(() => {
                this.props.openEdit(e, row);
                this.props.closeAlert();
                clearTimeout(this.timerAlert);
            }, 1333)
        }
        else {
            variant = 'warning'
            text = "Nothing selected."
            this.props.showAlert('edit', ['Editing: ' + text], variant, false, true, variant)
            
            this.timerAlert = setTimeout(() => {
                this.props.closeAlert();
                clearTimeout(this.timerAlert);
            }, 2000)
        }
    }

    handleEditBtnBlur= () => {
        // close alert
        // this.closeAlert()
    }

    handleDeleteBtnClick = (e) => {
        e.preventDefault()
        console.debug("Delete Selected")
        let text = ''
        let variant = 'disabled'
        let button_disabled = true
        let show_button = false
        const sel_cnt = this.props.selected.length
        console.debug('Selected Count: ' + sel_cnt)
        if(sel_cnt > 1) {
            text = ' ' + sel_cnt + ' entries!'
            variant = 'danger'
            button_disabled = false
            show_button = true
        }
        else if(sel_cnt === 1) {
            text = ' ' + sel_cnt + ' entry!'
            variant = 'warning'
            button_disabled = false
            show_button = true
        }
        else {
            text = ' Nothing selected'
            this.timerAlert = setTimeout(() => {
                this.props.closeAlert();
                clearTimeout(this.timerAlert);
            }, 2000)
        }
        // Alert to confirm
        // showAlert (action, text[], variant, show_button, button_disabled, button_variant)
        this.props.showAlert('delete', ['Deleting: ' + text], variant, show_button, button_disabled, variant)

    }

    handleDeleteBtnBlur = () => {
        // close alert
        // this.closeAlert()
    }

    /*
    // handleOnSelectAll = (isSelect, rows) => {
    //     const ids = rows.map(r => r.id);
    //     if (isSelect) {
    //         this.setState(() => ({
    //             selected: ids
    //         }));
    //     } else {
    //         this.setState(() => ({
    //             selected: []
    //         }));
    //     }
    // }
     */
    
    handleCopyBtnClick = (e) => {
        e.preventDefault()
        console.debug("Copy Selected")
        console.debug(this.props.selected)

        let text = ''
        let variant = 'disabled'
        let button_disabled = true
        let show_button = false
        const sel_cnt = this.props.selected.length
        console.debug('Selected Count: ' + sel_cnt)
        if(sel_cnt > 1) {
            text = ' ' + sel_cnt + ' entries!'
            variant = 'danger'
            button_disabled = false
            show_button = true
        }
        else if(sel_cnt === 1) {
            text = ' ' + sel_cnt + ' entry.'
            variant = 'warning'
            button_disabled = false
            show_button = true
        }
        else {
            text = ' Nothing selected.'
            this.timerAlert = setTimeout(() => {
                this.props.closeAlert();
                clearTimeout(this.timerAlert);
            }, 1667)
        }
        // Alert to confirm
        // showAlert (action, text[], variant, show_button, button_disabled, button_variant)
        this.props.showAlert('copy', ['Copy: ' + text], variant, show_button, button_disabled, variant)
    }

    render() {
        const selectRow = {
            mode: 'checkbox',
            clickToSelect: true,
            clickToEdit: true,
            clickToExpand: false,
            // selected: this.state.selected,
            selected: this.props.selected,
            // onSelect: this.handleOnSelect,
            onSelect: this.props.handleOnSelect,
            onSelectAll: this.props.handleOnSelectAll,
        };
        const expandRow = {
            renderer: row => (
                <Container fluid="sm">                    
                    {this.state.item.filter(item => item.id === row.id).map((item) => (
                        <React.Fragment key={`s-row-${item.id}`}>
                            <Row>
                                <Col xs={1}>Password:</Col>
                                <Col>{item.password}</Col>
                            </Row>
                            <Row>
                                <Col xs={1}>Comment:</Col>
                                <Col>{item.comment}</Col>
                            </Row>
                        </React.Fragment>
                    ))}
                </Container>
            ),
            showExpandColumn: true,
            expanded: this.state.expanded,
            onExpand: this.handleOnExpand,
            // onExpandAll: this.handleOnExpandAll,
            expandByColumnOnly: true,
            expandHeaderColumnRenderer: ({ isAnyExpands }) => {
                if (isAnyExpands) {
                    return <b >-</b>;
                }
                return <b>+</b>;
            },
            expandColumnRenderer: ({ expanded }) => {
                if (expanded) {
                    return (
                    <b>-</b>
                    );
                }
                return (
                    <b>...</b>
                );
                }
        };
        return (
        // <div>
            <Container>
                <Row>
                    <Col xs={2} md={1}>
                    <Button variant={this.props.passwordsEditBtnVariant} 
                        onClick={this.handleEditBtnClick}
                        onBlur={this.handleEditBtnBlur}
                    >
                        Edit
                    </Button>
                    </Col>
                    <Col xs={2} md={1}>
                    <Button variant={this.props.passwordsDelBtnVariant} 
                        onClick={this.handleDeleteBtnClick}
                        onBlur={this.handleDeleteBtnBlur}
                    >
                        Delete
                    </Button>        
                    </Col>
                    <Col xs={2} md={1}>
                    <Button variant={this.props.passwordsCopyBtnVariant}
                        onClick={this.handleCopyBtnClick}
                        onBlur={null}
                    >
                        Copy
                    </Button>        
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <BootstrapTable 
                        bootstrap4
                        keyField="id" 
                        data={ this.props.data } 
                        columns={ this.props.columns } 
                        defaultSorted={ this.props.defaultSorted }
                        expandRow={ expandRow }
                        selectRow={ selectRow }
                        filter={ filterFactory() }
                        pagination={ paginationFactory(this.options) }
                        striped
                        hover
                        condensed
                        bordered={ false }
                    />
                    </Col>
                </Row>
            </Container>
        // </div>
        );
    }
}

export default CustomTable2


/* <ToolkitProvider
                keyField="id" 
                data={ this.props.data } 
                columns={ this.props.columns } 
                search={ {
                    onColumnMatch: this.customMatchFunc,
                    searchFormatted: true

                } }
            >
            {
                props => (
                    <div>
                        <SearchBar 
                            { ...props.searchProps } 
                        />
                        <ClearSearchButton 
                            { ...props.searchProps } 
                        />
                        <hr/> 
                    </div>
                    )

    </ToolkitProvider>
                        */