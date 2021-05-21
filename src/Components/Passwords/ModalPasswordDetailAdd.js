import React, { Component } from "react";
import {
    Button
} from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import ModalHeader from "react-bootstrap/ModalHeader"
import ModalBody from "react-bootstrap/ModalBody"
import ModalFooter from "react-bootstrap/ModalFooter"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import PasswordField from "../PasswordField";

export default class ModalPasswordDetailAdd extends Component {

    constructor(props){
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        
        let { name, value } = e.target;

        if (e.target.type === "checkbox") {
            value = e.target.checked;
        }

        const activeItem = { ...this.state.activeItem, [name]: value };
        
        this.setState({ activeItem });
        
    };

    render() {
        const { isOpen, closeModal} = this.props;
        const { activeItem } = this.state;
        
        return(
        <Modal 
        show={isOpen} 
        onHide={closeModal}
        >
            <ModalHeader closeButton >Password Add</ModalHeader>
            <ModalBody>
                <Form>
                    <Form.Group >
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            name="title" 
                            type="text" 
                            value={this.state.activeItem.title} 
                            onChange={this.handleChange}></Form.Control>
                        <Form.Text>Enter Title</Form.Text>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>User Name</Form.Label>
                        <Form.Control 
                            name="username" 
                            type="text" 
                            value={this.state.activeItem.username} 
                            onChange={this.handleChange}></Form.Control>
                        <Form.Text>Enter User Name</Form.Text>
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Password</Form.Label>
                            {/* <Form.Control 
                                name="password" 
                                type="password" 
                                value={this.state.activeItem.password} 
                                onChange={this.handleChange}></Form.Control> */}
                            <PasswordField 
                                name="password"
                                value={this.state.activeItem.password} 
                                onChange={this.handleChange}></PasswordField>
                            <Form.Text>Enter Password</Form.Text>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control 
                                name="password2" 
                                type="password" 
                                value={this.state.activeItem.password2} 
                                onChange={this.handleChange}></Form.Control>
                            <Form.Text>Enter Password</Form.Text>
                        </Form.Group>
                    </Form.Row>
                    

                    <Form.Group >
                        <Form.Label>Site Email</Form.Label>
                        <Form.Control
                        name="email"
                        type="email"
                        value={this.state.activeItem.email} 
                        onChange={this.handleChange}
                        ></Form.Control>
                        <Form.Text>Enter site URL</Form.Text>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Site URL</Form.Label>
                        <Form.Control
                        name="url"
                        type="url"
                        value={this.state.activeItem.url} 
                        onChange={this.handleChange}
                        ></Form.Control>
                        <Form.Text>Enter site URL</Form.Text>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                        name="comment"
                        as="textarea"
                        value={this.state.activeItem.comment} 
                        onChange={this.handleChange}
                        ></Form.Control>
                        <Form.Text>Enter site comment</Form.Text>
                    </Form.Group>
                </Form>
            </ModalBody>
            <ModalFooter>
            <Button variant="primary" type="submit" onClick={() => this.props.handleSubmit(activeItem)}>
                Save
            </Button>
            <Button variant="secondary" type="submit" onClick={closeModal}>
                Cancel
            </Button>
            </ModalFooter>
        </Modal>
        )
    }
}