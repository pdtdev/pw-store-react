import React, { Component } from 'react'

class TblHeadPasswords extends Component {

    render() {

        return(
            <React.Fragment>
                <thead>
                    <tr>
                    <th>
                        Title
                    </th>
                    <th>
                        User Name
                    </th>
                    <th>
                        Update Time
                    </th>
                    </tr>
                </thead>
            </React.Fragment>
        )
    }
}

export default TblHeadPasswords;