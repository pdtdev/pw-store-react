import React, { Component } from 'react'
import { DateTime } from "luxon";

const DATETIME_FORMAT = 'd MMM yyyy HH:mm'

class TblBodyPasswords extends Component {

    render() {

        return(
            <React.Fragment>
                <tbody>
                    {this.props.password_items.map(item => (
                        
                        <React.Fragment key={item.id}>
                        <tr onClick={() => this.props.openModal(item)}>
                            <td>
                                {item.title}
                            </td>
                            <td>
                                {item.username}
                            </td>
                            <td>
                                { DateTime.fromISO(item.update_time).toFormat(DATETIME_FORMAT) }
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

export default TblBodyPasswords;