import React, { Component } from "react";
import {
    Button
} from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import ModalHeader from "react-bootstrap/ModalHeader"
import ModalBody from "react-bootstrap/ModalBody"
import ModalFooter from "react-bootstrap/ModalFooter"
import Form from "react-bootstrap/Form"
import PasswordField from "../PasswordField";

class ModalPasswordDetail extends Component {

    constructor(props){
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
            error: {
                "title": "",
				"username": "",
				"password": "",
				"email": "",
				"url": "",
				"comment": "",
            },
            isError: {
                "title": "",
				"username": "",
				"password": "",
				"email": "",
				"url": "",
				"comment": "",
            }
        }
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
        console.debug(activeItem.title)
        return(
        <Modal 
        show={isOpen} 
        onHide={closeModal}
        >
            <ModalHeader closeButton >Password Edit</ModalHeader>
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
                            autoComplete="username" 
                            value={this.state.activeItem.username} 
                            onChange={this.handleChange}></Form.Control>
                        <Form.Text>Enter User Name</Form.Text>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Password</Form.Label>
                        {/* <Form.Control 
                            name="password" 
                            type="password"
                            autoComplete="current-password"
                            value={this.state.activeItem.password} 
                            onChange={this.handleChange}></Form.Control> */}
                        <PasswordField 
                            name="password"
                            autoComplete="current-password"
                            value={this.state.activeItem.password} 
                            onChange={this.handleChange}></PasswordField>
                        <Form.Text>Enter Password</Form.Text>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Site Email</Form.Label>
                        <Form.Control
                        name="email"
                        type="email"
                        value={this.state.activeItem.email} 
                        onChange={this.handleChange}
                        ></Form.Control>
                        <Form.Text>Enter site email</Form.Text>
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
            <Button variant="danger" onClick={() => this.props.handleDelete(activeItem)}>
                Delete
            </Button>
            <Button variant="secondary" onClick={closeModal}>
                Cancel
            </Button>
            </ModalFooter>
        </Modal>
        )
    }
}

export default ModalPasswordDetail