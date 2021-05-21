import React, { Component } from 'react'
import BTable from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { matchSorter } from "match-sorter";
import Axios from 'axios';

// react-table
//    https://react-table.tanstack.com
//  
import { useTable, usePagination, useSortBy, useFilters, 
    useGlobalFilter, useAsyncDebounce, useExpanded, } from 'react-table'

const base_url = window.SERVER_ADDRESS

function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length

    return (
        <input 
            className="form-control mb-3"
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    }) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <span>
        Search:{' '}
        <input
            className="form-control mb-3"
            value={value || ""}
            onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
            }}
            placeholder={`${count} records...`}
        />
        </span>
    )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

// override the default text filter to use
//    "startsWith"
function defaultTextFilterFn(rows, id, filterValue) {

    return rows.filter(row => {
        const rowValue = row.values[id]
        return rowValue !== undefined
        ? String(rowValue)
            .toLowerCase()
            .startsWith(String(filterValue).toLowerCase())
        : true
    })
}

// renderRowSubComponent 
// updateMyData

function Table({ columns: userColumns, data, skipPageReset, logout}) {
    
    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: fuzzyTextFilterFn,
            // override the default text filter to use
            text: defaultTextFilterFn,
        }),
        []
    )
    
    // Set our editable cell renderer as the default Cell renderer
    // Set our default column filter as the default Filter renderer 
    const defaultColumn = React.useMemo(
        () => ({ 
        // Cell: EditableCell, 
        Filter: DefaultColumnFilter
    }), []
    )

    /// For this example, we're using pagination to illustrate how to stop
  // the current page from resetting when our data changes
  // Otherwise, nothing is different here.
    const {
        // Instance Properties
        getTableProps,
        getTableBodyProps,
        headerGroups,
        visibleColumns,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        preGlobalFilteredRows,
        setGlobalFilter,
        state: { pageIndex, pageSize , globalFilter },
        } = useTable(
        {
            columns: userColumns,
            data,
            defaultColumn,
            filterTypes,
            initialState: {pageSize: 5},
            // use the skipPageReset option to disable page resetting temporarily
            autoResetPage: !skipPageReset,
            // updateMyData isn't part of the API, but
            // anything we put into these options will
            // automatically be available on the instance.
            // That way we can call this function from our
            // cell renderer!
            // updateMyData,
            // getSubRows,
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useExpanded,
        usePagination
    )

    // Render the UI for your table
    // 
    return (
        <>
        <BTable striped bordered hover size="sm" {...getTableProps()}>
        <thead>
            {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                        {column.isSorted
                        ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                        : ''}
                    </span>
                </th>
                ))}
            </tr>
            ))}
            <tr>
                {visibleColumns.map(column => (
                <th {...column.getHeaderProps()}>
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
                ))}
            </tr>
            <tr>
                <th
                    colSpan={visibleColumns.length}
                    style={{
                        textAlign: 'left',
                    }}
                >
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                </th>
            </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
            prepareRow(row)
            return (
                <React.Fragment key={row.id}>
                    {/*  */}
                <tr {...row.getRowProps()} 
                title={row.original.email ? row.original.email + ' : ' + row.original.url : row.original.url}
                // onBlur={row.isExpanded ? row.toggleRowExpanded({isExpanded: true}) : null } // isExpanded
                >
                {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
                </tr>
                {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                {row.isExpanded ? (
                <tr>
                <td colSpan={visibleColumns.length}>
                    {/*
                        Inside it, call our renderRowSubComponent function. In reality,
                        you could pass whatever you want as props to
                        a component like this, including the entire
                        table instance. But for this example, we'll just
                        pass the row
                        -------------
                        Table Row Sub
                        -------------
                    */
                    <TableRowSub 
                        orig_row={row.original}
                        logout={logout}
                    />
                    }
                    {/* {renderRowSubComponent({ row })} */}
                </td>
                </tr>
                ) : null}
                </React.Fragment>
            )
            })}
        </tbody>
        </BTable>
        <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
        </button>{' '}
        <span>
            Page{' '}
            <strong>
            {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
        </span>
        <span>
            | Go to page:{' '}
            <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
            }}
            style={{ width: '100px' }}
            />
        </span>{' '}
        <select
            value={pageSize}
            onChange={e => {
            setPageSize(Number(e.target.value))
            }}
        >
            {[5, 10, 15, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
                Show {pageSize}
            </option>
            ))}
        </select>
        </div>
        </>
    )
}

/**
 * TODO : FIX
 * WORK AROUND use component
 */
class TableRowSub extends Component {
    _isMounted = false;

    constructor(props) {
        super(props)

        this.state = {
            item: null,
            input_type: 'password',
            btn_text: 'Show',
            btn_variant: 'warning'
        }
    }

    componentDidMount() {

        this._isMounted = true;

        if (this.props.orig_row && this.props.orig_row.id) {
            const id = this.props.orig_row.id
            Axios.get(base_url + `api/v3/${id}/`, {
                headers : {
                    Authorization : `Token ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                this.setState({item: response.data});
                // return response.data;
            })
            .catch(error => {
                if(error.response) {
                    if(error.response.status === 401) {
                        console.debug("Token - Auth Failed")
                        console.debug(error.response.data.detail)
                        this.props.logout()
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
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    showHide = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            input_type: this.state.input_type === 'text' ? 'password' : 'text',
            btn_text: this.state.input_type === 'text' ? 'Show' : 'Hide',
            btn_variant: this.state.input_type === 'text' ? 'warning' : 'info',
        });
    }

    copyCodeToClipboard = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const el = this.textInput
        if(this.state.input_type === 'password') {
            // change to text to copy
            this.setState({
                input_type: 'text',
                btn_text: 'Hide',
                btn_variant: 'info',
            })
            // doesn't select after type change
            // document.execCommand("copy")
            // this.setState({input_type: 'password'})
            // leave as password
        }
        else { // is 'text', copies fine
            // set to password
            this.setState({
                input_type: 'password',
                btn_text: 'Show',
                btn_variant: 'warning',
            })
        }
        el.select()
        document.execCommand("copy")
    }

    render() {
        return (
            <>
            {this.state.item !== null ?
            <div>
                <Form.Group>
                    <Form.Label>Password: </Form.Label>
                    <Form.Control
                        readOnly={true}
                        type={this.state.input_type} 
                        value={this.state.item.password}
                        placeholder={this.state.item.password === '' ? "NO PASSWORD" : null}
                        ref={(textinput) => this.textInput = textinput}
                    ></Form.Control>
                    <Button 
                        variant={this.state.btn_variant} 
                        onClick={this.showHide}
                        disabled={this.state.item.password === '' ? true : false}>
                    {this.state.btn_text + ' Password'}
                    </Button>
                    <Button 
                        variant={this.state.input_type === 'password' ? 'outline-info' : 'info'} 
                        onClick={this.copyCodeToClipboard}
                        // onBlur={}
                        disabled={this.state.item.password === '' || this.state.input_type === 'password' ? true : false}
                        title={this.state.input_type === 'password' ? 'Show Password before copying' : null}
                        >
                    Copy to Clipboard
                    </Button>
                </Form.Group>
            </div>
            : null
            }
            {this.state.item !== null && this.state.item.comment !== '' ?
            <div>
                <Form.Group>
                    <Form.Label>Comment: </Form.Label>
                    <Form.Control
                    readOnly={true}
                    as="textarea"
                    value={this.state.item !== null ? this.state.item.comment : null}
                    ></Form.Control>
                </Form.Group>
            </div> 
            : null
            }
            </>
        )
    }
    
}

export default Table;






// Create an editable cell renderer
// const EditableCell = ({
//     value: initialValue,
//     row: { index },
//     column: { id },
//     updateMyData, // This is a custom function that we supplied to our table instance
//     }) => {
//         // We need to keep and update the state of the cell normally
//         const [value, setValue] = React.useState(initialValue)

//         const onChange = e => {
//             setValue(e.target.value)
//         }

//         // We'll only update the external data when the input is blurred
//         const onBlur = () => {
//             updateMyData(index, id, value)
//         }

//         // If the initialValue is changed external, sync it up with our state
//         React.useEffect(() => {
//             setValue(initialValue)
//         }, [initialValue])

//         return (
//         <input 
//             className="form-control mb-3" 
//             value={value} 
//             onChange={onChange} 
//             onBlur={onBlur} 
//         />
//         )
// }