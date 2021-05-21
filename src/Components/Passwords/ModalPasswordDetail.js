import React, { Component } from "react";
import Modal from "react-bootstrap/Modal"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import ModalHeader from "react-bootstrap/ModalHeader"
import ModalBody from "react-bootstrap/ModalBody"
import ModalFooter from "react-bootstrap/ModalFooter"
import Form from "react-bootstrap/Form"
import PasswordField from "../PasswordField";
import Alert from "react-bootstrap/Alert";

class ModalPasswordDetail extends Component {

    constructor(props){
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
            password2: '',
            error: {
                "title": "",
				"username": "",
				"password": "",
                "password2": "",
				"email": "",
				"url": "",
				"comment": "",
            },
            isError: {
                "title": "",
				"username": "",
				"password": "",
                "password2": "",
				"email": "",
				"url": "",
				"comment": "",
            }
        }
        
        this.handleChange = this.handleChange.bind(this)
        
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
        backdrop="static"
        keyboard={true}
        scrollable={true}
        size="md"
        >
            <ModalHeader closeButton >Password Edit</ModalHeader>
            <ModalBody>
                <Form onSubmit={(e) => this.props.handleSubmit(e, activeItem)}>
                    <Container>
                        <Form.Group >
                        <Row>
                            <Col xs={2} md={2}>
                                <Form.Label>Title</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control 
                                    name="title" 
                                    type="text" 
                                    value={this.state.activeItem.title} 
                                    onChange={this.handleChange}></Form.Control>
                                <Form.Text>Enter Title</Form.Text>
                            </Col>
                        </Row>
                        </Form.Group>
                        <Form.Group >
                        <Row>
                            <Col xs={2} md={2}>
                                <Form.Label>User Name</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control 
                                    name="username" 
                                    type="text"
                                    autoComplete="username" 
                                    value={this.state.activeItem.username} 
                                    onChange={this.handleChange}></Form.Control>
                                <Form.Text>Enter User Name</Form.Text>
                            </Col>
                        </Row>
                        </Form.Group>
                        
                        <Form.Group >
                            <Row>
                                <Col xs={2} md={2}>
                                    <Form.Label>Password</Form.Label>
                                </Col>
                                <PasswordField 
                                    name="password"
                                    autoComplete="current-password"
                                    value={this.state.activeItem.password} 
                                    onChange={this.handleChange} />
                            </Row>
                        </Form.Group>
                        <Form.Group>
                            <Row>
                                <Col xs={2} md={2}>
                                    <Form.Label>Password Again</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control 
                                        name="password2" 
                                        type="password"
                                        autoComplete="current-password"
                                        value={this.state.password2} 
                                        onChange={this.handleChange}></Form.Control>
                                    <Form.Text>Enter Password Again</Form.Text>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group >
                            <Row>
                                <Col xs={2} md={2}>
                                    <Form.Label>Email</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        name="email"
                                        type="email"
                                        value={this.state.activeItem.email} 
                                        onChange={this.handleChange}></Form.Control>
                                    <Form.Text>Enter site email</Form.Text>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group >
                            <Row>
                                <Col xs={2} md={2}>
                                    <Form.Label>URL</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                    name="url"
                                    type="url"
                                    value={this.state.activeItem.url} 
                                    onChange={this.handleChange}></Form.Control>
                                    <Form.Text>Enter site URL</Form.Text>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group >
                            <Row>
                                <Col xs={2} md={2}>
                                    <Form.Label>Comment</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                    name="comment"
                                    as="textarea"
                                    value={this.state.activeItem.comment} 
                                    onChange={this.handleChange}
                                    ></Form.Control>
                                    <Form.Text>Enter site comment</Form.Text>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Container>
                </Form>
                <Alert show={false} onClose={null} dismissible>
                    { "." }
                </Alert>
            </ModalBody>
            <ModalFooter>
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