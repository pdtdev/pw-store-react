import React from 'react'
import Table from '../CustomTable'
// import PasswordField from '../PasswordField'
import { DateTime } from "luxon";
import Button from 'react-bootstrap/Button';


const DATETIME_FORMAT = 'd MMM yyyy HH:mm'



// handleExpandData, activeItem

const handleLinkClick = (e) => {
    e.preventDefault()
    
}

const TitleFmtCell = ({ row }) => {
// We need to keep and update the state of the cell normally
// const [value, setValue] = React.useState(initialValue)

    // const onChange = e => {
    //     setValue(e.target.value)
    // }

    // We'll only update the external data when the input is blurred
    // const onBlur = () => {
    //     updateMyData(index, id, value)
    // }

    // If the initialValue is changed external, sync it up with our state
    // React.useEffect(() => {
    //     setValue(initialValue)
    // }, [initialValue])

    return (
    <>
        <a 
            href={row.original.url} 
            title={row.original.url}
            onClick={handleLinkClick}
        >
        {row.original.title}
        </a> 
    </>
    // <input 
    //     className="form-control mb-3" 
        
    //     // onChange={onChange} 
    //     // onBlur={onBlur} 
    // />
    )
}


const DateTimeFmtCell = ({
    value: initialValue,
    // row: { index },
    // column: { id },
    // updateMyData, // This is a custom function that we supplied to our table instance
    }) => {
        // We need to keep and update the state of the cell normally
        const [value, setValue] = React.useState(initialValue)

        // const onChange = e => {
        //     setValue(e.target.value)
        // }

        // We'll only update the external data when the input is blurred
        // const onBlur = () => {
        //     updateMyData(index, id, value)
        // }

        // If the initialValue is changed external, sync it up with our state
        React.useEffect(() => {
            setValue(initialValue)
        }, [initialValue])

        return (
        <>
        {DateTime.fromISO(value).toFormat(DATETIME_FORMAT) } 
        </>
        // <input 
        //     className="form-control mb-3" 
            
        //     // onChange={onChange} 
        //     // onBlur={onBlur} 
        // />
        )
}




function TblPasswordsCustom({data, openModal, logout})  {

    const columns = React.useMemo(
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
    
    // After data chagnes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset
    React.useEffect(() => {
        setSkipPageReset(false)
        }, [data]
    )
    
    return(
        <>
            <Table
                columns={columns}
                data={data}
                // updateMyData={updateMyData}
                skipPageReset={skipPageReset}
                logout={logout}
                // renderRowSubComponent={renderRowSubComponent}
                // getSubRows={getSubRows}
            />
        </>
    )
    
}

export default TblPasswordsCustom;

// const UrlFmtCell = ({
//     value: initialValue,
//     row: { index },
//     column: { id },
// }) => {
// // We need to keep and update the state of the cell normally
// const [value, setValue] = React.useState(initialValue)

//     // const onChange = e => {
//     //     setValue(e.target.value)
//     // }

//     // We'll only update the external data when the input is blurred
//     // const onBlur = () => {
//     //     updateMyData(index, id, value)
//     // }

//     // If the initialValue is changed external, sync it up with our state
//     React.useEffect(() => {
//         setValue(initialValue)
//     }, [initialValue])

//     return (
//     <>
//         <a href={value}>{value}</a> 
//     </>
//     // <input 
//     //     className="form-control mb-3" 
        
//     //     // onChange={onChange} 
//     //     // onBlur={onBlur} 
//     // />
//     )
// }


      // Create a function that will render our row sub components
    // const renderRowSubComponent = React.useCallback(
    // ({ row }) => (
        
    //     // get data
    //     <div>
    //     <pre
    //     style={{
    //         fontSize: '10px',
    //     }}
    //     >
    //         <code>
    //             {JSON.stringify({ values: row.values }, null, 2)}
    //             ,
    //             {JSON.stringify({ original: row.original }, null, 2)}
    //             ,
    //             {JSON.stringify({ subRows: row.subRows }, null, 2)}

    //         </code>
    //     </pre>
    //     {/* {handleExpandData(row)} */}
    //     </div>
        
        
    // ),
    // []  // handleExpandData
    // )

        // {
        //     // Make an edit cell
        //     Header: () => null, // No header
        //     id: 'edit', // It needs an ID
        //     Cell: ({ row }) => (
        //         <Button 
        //             key={row.id}
        //             variant="link"
        //             onClick={(e) => openModal(e, row.original)}
        //         >
        //         Edit
        //         </Button>
        //     ),
        //     },


  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
    // const updateMyData = (rowIndex, columnId, value) => {
    //     // We also turn on the flag to not reset the page
    //     setSkipPageReset(true)
    //     console.debug({...data[rowIndex],[columnId]: value,})

    //     handlePasswordDetailChange({...data[rowIndex],[columnId]: value,})

    //     // setData(old =>
    //     //     old.map((row, index) => {
    //     //     if (index === rowIndex) {
    //     //         // console.debug('Old row ', old[rowIndex])
    //     //         console.debug({...old[rowIndex],[columnId]: value,})
    //     //         handlePasswordDetailChange({...old[rowIndex],[columnId]: value,}, refreshPasswordItems)
    //     //         return {...old[rowIndex],[columnId]: value,}
    //     //     }
    //     //     return row
    //     //     })
    //     // )

    //     // console.debug('> Update data <')
    //     // console.debug(rowIndex, columnId, value)
    //     // console.debug(data[rowIndex][columnId])
    // }

