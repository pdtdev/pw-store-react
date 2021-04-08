import React, { Component } from 'react'
// import {Row} from 'reactstrap';

// const base_url = window.SERVER_ADDRESS

class ListPasswords extends Component {
    constructor(props) {
        super(props)
        this.state = {
            logged_in: this.props.logged_in,
            items: [],
            itemSelected : ''
        }
    }

    componentDidMount(){
        
        console.log("ListPasswords : did mount");

		if(this.state.logged_in) {
            
            console.log("ListPasswords : logged in");

            // this.setState({items: this.props.items});
        }
	}

    render() {
        // const row_item = (<div></div>);
        return(
            <dl>
                {this.state.items.map(item => (
                    // Without the `key`, React will fire a key warning
                    <React.Fragment key={item.id}>
                    <dt>{item.title}</dt>
                    <dd>{item.username}</dd>
                    <dd>{item.update_time}</dd>
                    </React.Fragment>
                ))}
            </dl>
        )
    }
}

export default ListPasswords;