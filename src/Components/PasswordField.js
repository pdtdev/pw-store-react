import React, { Component } from 'react';
// import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// import styles from './PasswordField.less';

/**
 *** PasswordField - react-bootstrap ***
 * Implements: <Form.Control> only in <Form.Group>
 * 
 * This pattern is required:
 * <Form.Group>
 *     <PasswordField>
 */
class PasswordField extends Component {
    
    state = {
        type: 'password',
        button_text: 'Show',
        button_variant: 'warning'
    };
    
    togglePassword = (e) => {
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
            
            <Col>
                <Form.Control type={this.state.type} {...this.props}></Form.Control>
                {/* <Form.Text>Enter password</Form.Text> */}
            </Col>
            <Col xs={2} md={3}>
                <Button variant={this.state.button_variant} onClick={this.togglePassword}>
                    {this.state.button_text}
                </Button>
            </Col>
            
        </React.Fragment>
    );
    }
}

export default PasswordField;