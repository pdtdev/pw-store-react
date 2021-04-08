// import logo from './logo.svg';
import Axios from 'axios';
import React, { Component } from 'react';
import './App.css';
import Alert from 'react-bootstrap/Alert'
import NavComponent from './Components/NavComponent';
import ModalPasswordDetail from './Components/Passwords/ModalPasswordDetail';
import ModalPasswordDetailAdd from './Components/Passwords/ModalPasswordDetailAdd';
// import ListPasswords from './Components/Passwords/ListPasswords';
import TblPasswords from "./Components/Passwords/TablePasswords";
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup'
import { DateTime } from "luxon";

const base_url = window.SERVER_ADDRESS
const DATETIME_FORMAT = 'd MMM yyyy H:mm'
// const DATE_FORMAT = 'd MMM yyyy'
const TIME_FORMAT = 'H:mm'

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			logged_in : localStorage.getItem('token') ? true : false,
			displayed_form : '',
			isOpen: false,
			isAlertLogin: false,
			password_items: [],
			activeItem: {
				"id": -1,
				"user": "",
				"title": "",
				"username": "",
				"password": "",
				"email": "",
				"url": "",
				"comment": "",
				"update_time": "",
				"flag": ""
			},
			isOpenAdd: false,
			addItem: {
				"title": "",
				"username": "",
				"password": "",
				"password2": "",
				"email": "",
				"url": "",
				"comment": "",
			},
		}
	}

	componentDidMount(){
		
		console.debug("App : did mount");
		
		if(this.state.logged_in) {
			
			this.refreshPasswordItems()

			console.debug("App : logged in");
		}
		else {
			console.debug("App : logged out");
		}
	}

	refreshPasswordItems = () => {

        if(this.state.logged_in) {

            Axios.get(base_url + 'api/v3/', {
				headers : {
					Authorization : `Token ${localStorage.getItem('token')}`
				}
			})
			.then(res => {
				this.setState({password_items: res.data});
			})
			.catch(error => {
				console.debug(error.response);
				if(error.response.status === 401) {
					console.debug("Token - Auth Failed")
					console.debug(error.response.data.detail)
					this.handleLogout();
				}
				
			})
        }
    }

	openModal = (item) => {
		
		console.debug("Id: "+item.id)

		if(this.state.logged_in) {

            Axios.get(base_url + `api/v3/${item.id}/`, {
				headers : {
					Authorization : `Token ${localStorage.getItem('token')}`
				}
			})
			.then(response => {
				this.setState({activeItem: response.data, isOpen: true});
			})
			.catch(error => {
				if(error.response) {
					if(error.response.status === 401) {
						console.debug("Token - Auth Failed")
						console.debug(error.response.data.detail)
						this.handleLogout()
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
	}

	openModalAdd = () => {
		this.setState({isOpenAdd: true})
	}
	
	closeModal = () => this.setState({ isOpen: false });
	
	closeModalAdd = () => this.setState({ isOpenAdd: false });

	display_form = (formName) => {
        this.setState({
            displayed_form : formName
        });
		// clear login alert
		if(formName === 'login') {
			this.setState({isAlertLogin: false})
		}
    }

	closeAlertLogin = () => { this.setState({isAlertLogin: false}) }

	handleLoginChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        })
	}
	
	handleLogout = () => {
		// TODO call API to logout
		localStorage.removeItem('token');
		this.setState({ logged_in: false })
	}

	handleLogin = (e, data) => {
		e.preventDefault();
		
		Axios.post(base_url + 'api/v3/token-auth/', data, {	})
		.then(response => {
			console.debug(response.data)
			localStorage.setItem('token', response.data.token);
			this.setState({ logged_in : true });
			this.refreshPasswordItems();
		})
		.catch(error => {
			if(error.response) {
				
				if (error.response.status === 400) {
					// Failed Login
					//   trigger alert
					this.setState({ isAlertLogin: true })
				}
			}
		})
				
		this.setState({
			displayed_form : ''
		})	
	}

	handlePasswordDetailDelete = (item) => {
		Axios.delete(base_url + `api/v3/${item.id}/`, {
			headers : {
				Authorization : `Token ${localStorage.getItem('token')}`
			}
		})
		.then(response => this.refreshPasswordItems())
		.catch(err => {
			this.handleLogout();
			console.log(err)});

		this.setState({isOpen: false, 
			activeItem: {
				"id": -1,
				"user": "",
				"title": "",
				"username": "",
				"password": "",
				"email": "",
				"url": "",
				"comment": "",
				"update_time": "",
				"flag": ""
			}
		});
	}

	handlePasswordDetailChange = (item) => {

		Axios.put(base_url + `api/v3/${item.id}/`, item, {
			headers : {
				Authorization : `Token ${localStorage.getItem('token')}`
			}
		})
		.then(response => {
			this.refreshPasswordItems();
			if(response) {
				console.debug(response.data)
			}
			this.setState({isOpen: false, 
				activeItem: {
					"id": -1,
					"user": "",
					"title": "",
					"username": "",
					"password": "",
					"email": "",
					"url": "",
					"comment": "",
					"update_time": "",
					"flag": ""
				}
			});
		})
		.catch(error => {
			
			if(error.response) {
				if(error.response.status === 400) {
					console.debug("Edit Update Validation failed")
					Object.keys(error.response.data).map((item) => (
						console.debug(item + ' : ' + error.response.data[item])
						))
				}
				else if (error.response.status === 401) {
					console.debug("Token Auth Failed")
					console.debug(error.response.data.detail)
					this.handleLogout();
				}
			}
		});


	}

	handlePasswordAdd = (item) => {

		Axios.post(base_url + 'api/v3/', item, {
			headers : {
				Authorization : `Token ${localStorage.getItem('token')}`
			}
		})
		.then(response => {
			this.refreshPasswordItems();
			console.debug(response.data);
			this.setState({isOpenAdd: false, 
				addItem: {
					"title": "",
					"username": "",
					"password": "",
					"password2": "",
					"email": "",
					"url": "",
					"comment": "",
				}
			});
		})
		.catch(error => {
			if(error.response) {
				if(error.response.status === 400) {
					console.debug("Add Validation failed")
					// console.log(error.response.data)
					Object.keys(error.response.data).map((item) => (
						console.debug(item + ' : ' + error.response.data[item])
						))
				}
				else if (error.response.status === 401) {
					console.debug("Token Auth Failed")
					console.debug(error.response.data.detail)
					this.handleLogout();
				}
				
			}
		});
	}

	render() {
		const { 
			logged_in, username, first_name, displayed_form, 
				isOpen, activeItem, } = this.state;
		return (
			<main className="container">
				<NavComponent
					logged_in = {logged_in}
					handleLogin = {this.handleLogin}
					handleLoginChange = {this.handleLoginChange}
					handleLogout = {this.handleLogout}
					username = {username}
					first_name = {first_name}
					displayed_form = {displayed_form}
					display_form = {this.display_form}
					closeAlertLogin = {this.closeAlertLogin}
				/>
				<div>
					{this.state.logged_in ? 
					<LoginGreeting 
					logged_in = {logged_in}
					logout = {this.handleLogout}
					/> : 
					null}
					{this.state.logged_in ?
					<>
					<span>
					<Button onClick={this.openModalAdd}>
						Add Password
					</Button>
					</span>
					</> : 
					null}
					<div>
						{this.state.logged_in ? 
						<TblPasswords 
							logged_in = {logged_in}
							openModal = {this.openModal}
							password_items = {this.state.password_items}
						/> : 
						null}
					</div>
					{this.state.isAlertLogin && !this.state.logged_in ?
					<AlertLogin 
					closeAlertLogin = {this.closeAlertLogin} />
					: 
					null}
				</div>
				{this.state.logged_in && this.state.isOpen?
				<ModalPasswordDetail
					activeItem={activeItem}
					isOpen = {isOpen}
					closeModal={this.closeModal}
					handleSubmit={this.handlePasswordDetailChange}
					handleDelete={this.handlePasswordDetailDelete}
				/> : 
				null}
				{this.state.logged_in && this.state.isOpenAdd ?
				<ModalPasswordDetailAdd 
					activeItem={this.state.addItem}
					isOpen={this.state.isOpenAdd}
					closeModal={this.closeModalAdd}
					handleSubmit={this.handlePasswordAdd}
				/> : 
				null}
			</main>
		)
	}
}


class LoginGreeting extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			username: '',
			first_name: '',
			last_name: '',
			last_login: {
				"id": -1,
				"user": "",
				"username": "",
				"action": "",
				"ip_address": "",
				"user_agent": "",
				"update_time": ""
			}
		}; 
	}

	componentDidMount() {
		if(this.props.logged_in) {
			Axios.get(base_url + 'api/v3/current_user/', {
				headers : {
					Authorization : `Token ${localStorage.getItem('token')}`
				}
			})
			.then(resp => {
				this.setState({ 
					username: resp.data.username, 
					first_name: resp.data.first_name,
					last_name: resp.data.last_name 
				});
			}).catch(err => {
				this.props.logout()
				console.debug(err)
				
			})

			Axios.get(base_url + 'api/v3/login/history/last/', {
				headers : {
					Authorization : `Token ${localStorage.getItem('token')}`
				}
			}).then(resp => {
				if(resp.data.length > 0) {
					this.setState({last_login: resp.data[0]})
				}
				else {
					this.setState({last_login: {"id": -1,
					"user": "",
					"username": "",
					"action": "",
					"ip_address": "",
					"user_agent": "",
					"update_time": DateTime.now().toISO()}})
				}
			}).catch(err => {
				console.debug(err)
			})
		}
	}
	render() {
		const {username, first_name, last_name, last_login } = this.state;
		const now = DateTime.now();
		return(
			<>
				<ListGroup horizontal>
					<ListGroup.Item>User: {username}</ListGroup.Item>
					<ListGroup.Item>
						Last login: {DateTime.fromISO(last_login.update_time).toFormat(DATETIME_FORMAT)}</ListGroup.Item>
					<ListGroup.Item>From: {last_login.ip_address}</ListGroup.Item>
				</ListGroup>
				<ListGroup horizontal>
					<ListGroup.Item variant="info">Hello, {last_name}, {first_name}</ListGroup.Item>
					<ListGroup.Item>TZ: {now.zoneName}</ListGroup.Item>
					<ListGroup.Item>Last activity time: {now.toFormat(TIME_FORMAT)}</ListGroup.Item>
				</ListGroup>
			</>
		);
	}
}


class AlertLogin extends Component {
	render() {
		return (
			<Alert variant="danger" onClose={this.props.closeAlertLogin} dismissible>
				<Alert.Heading>Oh snap! Failed login!</Alert.Heading>
				<p>
				Login again with correct user name and password
				</p>
			</Alert>
		)
	}
}

export default App;
