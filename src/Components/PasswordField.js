import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// import styles from './PasswordField.less';

class PasswordField extends Component {
    
    state = {
        type: 'password',
        button_text: 'Show',
        button_variant: 'warning'
    };
    
    showHide = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            type: this.state.type === 'text' ? 'password' : 'text',
            button_text: this.state.type === 'text' ? 'Show' : 'Hide',
            button_variant: this.state.type === 'text' ? 'warning' : 'info',
        });
        // this.input.focus();
    }
    render(){
        // <div className={styles.password} >
        //     <FormControl type={this.state.type} {...this.props} inputRef={ref => { this.input = ref; }} />
        //     <span className={[styles.visibility, 'flaticon-eye', this.state.type === 'text' ? styles.is_visible : styles.is_hidden].join(' ')} onClick={this.showHide}></span>
        // </div>
    return(
        <React.Fragment>
            <Form.Control type={this.state.type} {...this.props}></Form.Control>
            <Button variant={this.state.button_variant} onClick={this.showHide}>
                {this.state.button_text} Password
            </Button>
        </React.Fragment>
    );
    }
}

export default PasswordField;