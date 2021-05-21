// import logo from './logo.svg';
import Axios from 'axios';
import React, { Component } from 'react';
import './App.css';
import Alert from 'react-bootstrap/Alert'
import { Container, Row, Col } from 'react-bootstrap';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import NavComponent from './Components/NavComponent';
import ModalPasswordDetail from './Components/Passwords/ModalPasswordDetail';
import ModalPasswordDetailAdd from './Components/Passwords/ModalPasswordDetailAdd';
// import ListPasswords from './Components/Passwords/ListPasswords';
// import TblPasswords from "./Components/Passwords/TablePasswords";
// import TblPasswordsCustom from "./Components/Passwords/TablePasswordsCustom";
import Tbl2PasswordsCustom from "./Components/Passwords/TablePasswordsCustom2";

import ContactsTable from "./Components/Contacts/ContactsTable"

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
			username: '',
			displayed_form : '',
			// ** Passwords **
			isOpen: false,
			isAlertLogin: false,
			isPasswordShow: false,
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
			selected: [],
			isReactTable: false,
			// ** Passwords - Edit button
			passwordsEditBtnVariant: 'outline-primary',
			// ** Passwords - Delete button
			passwordsDelBtnVariant: 'outline-secondary',
			// ** Passwords - Delete button
			passwordsCopyBtnVariant: 'outline-info',
			// ** Passwords - Pagination **
			passwords_count: null,
			password_page: 1,
			passwords_page_next: null,
			passwords_page_previous: null,
			// <Alert> with <Button>
			showAlert: false,
			showAlertBtnConfirm: false,
            alertText: [],
            alertVariant: 'info',
			alertBtnConfirmDisabled: true,
			alertBtnConfirmVariant: 'disabled',
			alertAction: '',
			// ** Contacts **
			contacts: [],

		}

		this.handleLogin = this.handleLogin.bind(this);
		this.handleLoginChange = this.handleLoginChange.bind(this);
		this.handlePasswordDetailDelete = this.handlePasswordDetailDelete.bind(this)
		this.handlePasswordDetailChange = this.handlePasswordDetailChange.bind(this)
	}

	componentDidMount(){
		
		console.debug("App : did mount");
		
		if(this.state.logged_in) {
			
			this.refreshPasswordItems()

			this.refreshContactItems()

			console.debug("App : logged in");
		}
		else {
			console.debug("App : logged out");
		}
	}

	refreshContactItems = () => {
		Axios.get(base_url + 'contacts/api/v3/', {
			headers : {
				Authorization : `Token ${localStorage.getItem('token')}`
			}
		})
		.then(res => {
			this.setState({contacts: res.data});
		})
		.catch(error => {
			console.debug(error.response);
			if(error.response) {
				if(error.response.status === 401) {
					console.debug("Token - Auth Failed")
					console.debug(error.response.data.detail)
					this.handleLogout();
				}
			}else {
				console.log("No response")
			}
		})
	}

	refreshPasswordItems = () => {

        if(this.state.logged_in) {

            Axios.get(base_url + 'passwords/api/v3/', {
				headers : {
					Authorization : `Token ${localStorage.getItem('token')}`
				}
			})
			.then(res => {
				// this.setState({password_items: res.data}); // ** without ** back-end pagination
				this.setState({
					password_items: res.data.results,
					passwords_count: res.data.count,
					passwords_page_next: res.data.next,
					passwords_page_previous: res.data.previous,
				}); // with back-end pagination

				console.debug('Page Next: ' + this.state.passwords_page_next)
				console.debug('Page Prev: ' + this.state.passwords_page_previous)
				console.debug('Total Page Count: ' + this.state.passwords_count)
			})
			.catch(error => {
				console.debug(error.response);
				if(error.response) {
					if(error.response.status === 401) {
						console.debug("Token - Auth Failed")
						console.debug(error.response.data.detail)
						this.handleLogout();
					}
				}else {
					console.log("No response")
				}
			})
        }
    }

	handleTableChange = (type, { page, sizePerPage }) => {
        // const currentIndex = (page - 1) * sizePerPage;
        
            this.setState(() => ({
				password_page: page,
				password_items: [],
            sizePerPage
            }));
        }

	toogleTable = () => this.setState({isReactTable: !this.state.isReactTable})

	openModal = (e, item) => {
		e.preventDefault()

		console.debug("Id: "+item.id)

		if(this.state.logged_in) {

            Axios.get(base_url + `passwords/api/v3/${item.id}/`, {
				headers : {
					Authorization : `Token ${localStorage.getItem('token')}`
				}
			})
			.then(response => {
				this.setState({
					activeItem: response.data, 
					isOpen: true});
				this.setState(() => ({
					selected: this.state.selected.filter(x => x !== item.id),
				}))
				if (this.state.selected.length === 0) {
					this.setState({
						passwordsEditBtnVariant: 'outline-primary',
						passwordsDelBtnVariant: 'outline-secondary',
						passwordsCopyBtnVariant: 'outline-info',
					})
				}
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

	handleExpandData = (item) => {
		
		console.debug('handleExpandData')
		console.debug(item)
		
		if(this.state.logged_in && item.user) {
            Axios.get(base_url + `passwords/api/v3/${item.id}/`, {
				headers : {
					Authorization : `Token ${localStorage.getItem('token')}`
				}
			})
			.then(response => {
				this.setState({activeItem: response.data});
				// return response.data;
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

	showPasswordClose = () => this.setState({isPasswordShow: false});

	showPassword = (item) => {
		
		if(this.state.logged_in) {

            Axios.get(base_url + `passwords/api/v3/${item.id}/`, {
				headers : {
					Authorization : `Token ${localStorage.getItem('token')}`
				}
			})
			.then(response => {
				this.setState({
					activeItem: response.data, 
					isPasswordShow: true,
				});
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

	closeAlertLogin = () => this.setState({isAlertLogin: false})

	handleLoginChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        })
	}
	
	handleLogout = () => {
		// TODO call API to logout and update backend (Django)
		localStorage.removeItem('token');
		this.setState({
			logged_in: false,
			username: '',
			password_items: [],
			selected: [],
			contacts: [],
		})
	}

	handleLogin = (e, data) => {
		e.preventDefault();
		
		Axios.post(base_url + 'passwords/api/v3/token-auth/', data, {	})
		.then(response => {
			console.debug(response.data)
			localStorage.setItem('token', response.data.token);
			this.setState({ logged_in : true });
			this.refreshPasswordItems();
			this.refreshContactItems();
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
		Axios.delete(base_url + `passwords/api/v3/${item.id}/`, {
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

	handlePasswordDetailChange = (e, item) => {
		e.preventDefault()
		// Update User Password item/row
		Axios.put(base_url + `passwords/api/v3/${item.id}/`, item, {
			headers : {
				Authorization : `Token ${localStorage.getItem('token')}`
			}
		})
		.then(response => {
			
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
			this.refreshPasswordItems();
		})
		.catch(error => {
			
			if(error.response) {
				console.debug(error.response)
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

		Axios.post(base_url + 'passwords/api/v3/', item, {
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

	handleRefresh = (e) => {
		e.preventDefault()
		
		this.refreshPasswordItems()
	}

	// App - Alert
	showAlert = (action, text, variant, show_button, button_disabled, button_variant) => {
		this.setState({
			showAlert: true,
            showAlertBtnConfirm: show_button,
			alertText: text,
            alertVariant: variant,
			alertBtnConfirmDisabled: button_disabled,
			alertBtnConfirmVariant: button_variant,
			alertAction: action,
		})
	}

	closeAlert = () => {
		this.setState({
			showAlert: false,
            // alertText: [],
            // alertVariant: 'info',
		})
	}

	handleAlertConfirmDeleteButton = () => {
		
		let api_calls = []

		this.state.selected.forEach(item => {
			api_calls.push(Axios.delete(base_url + `passwords/api/v3/${item}/`, {
				headers : {
					Authorization : `Token ${localStorage.getItem('token')}`
				}
			}))
		})

		Promise.all(api_calls)
			.then((results) => {
				console.debug(results);
				this.state.selected.forEach(item => {
					this.setState({
						selected : this.state.selected.filter(x => x !== item)
					})
				})
				this.refreshPasswordItems();
				this.closeAlert();	
				if (this.state.selected.length === 0) {
					this.setState({
						passwordsEditBtnVariant: 'outline-primary',
						passwordsDelBtnVariant: 'outline-secondary',
						passwordsCopyBtnVariant: 'outline-info',
					})
				}			
			})
			.catch(error => {
				if(error.response) {
					if(error.response.status === 401) {
						console.debug("Token - Auth Failed")
						console.debug(error.response.data.detail)
						this.showAlert('logout', [error.response.data.detail, '. Log out in 3 secs.'], 'warning')
						this.timerAlert = setTimeout(() => {
							this.handleLogout();
							this.closeAlert();
							clearTimeout(this.timerAlert);
						}, 3000);
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

	handleAlertConfirmCopyButton = () => {
		
		let api_calls = []

		this.state.selected.forEach(id => {
			api_calls.push(Axios.get(base_url + `passwords/api/v3/copy/${id}/`, {
				headers : {
					Authorization : `Token ${localStorage.getItem('token')}`
				}
			}))
		})

		Promise.all(api_calls)
			.then((results) => {
				console.debug(results);
				this.state.selected.forEach(id => {
					this.setState({
						selected : this.state.selected.filter(x => x !== id)
					})
				})
				this.refreshPasswordItems();
				this.closeAlert();
				if (this.state.selected.length === 0) {
					this.setState({
						passwordsEditBtnVariant: 'outline-primary',
						passwordsDelBtnVariant: 'outline-secondary',
						passwordsCopyBtnVariant: 'outline-info',
					})
				}		
			})
			.catch(error => {
				if(error.response) {
					if(error.response.status === 401) {
						console.debug("Token - Auth Failed")
						console.debug(error.response.data.detail)
						this.showAlert('logout', [error.response.data.detail, '. Log out in 3 secs.'], 'warning')
						this.timerAlert = setTimeout(() => {
							this.handleLogout();
							this.closeAlert();
							clearTimeout(this.timerAlert);
						}, 3000);
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

	handleOnSelect = (row, isSelect) => {
        
		if (isSelect) {
            this.setState(() => ({
				selected: [...this.state.selected, row.id],
				passwordsEditBtnVariant: 'primary', // set edit button
				passwordsDelBtnVariant: 'secondary',
				passwordsCopyBtnVariant: 'info',
            }));
			
        } else {
			if (this.state.selected.length - 1 === 0) {
				this.setState({
					passwordsEditBtnVariant: 'outline-primary',
					passwordsDelBtnVariant: 'outline-secondary',
					passwordsCopyBtnVariant: 'outline-info',
				})
			}
			this.setState(() => ({
				selected: this.state.selected.filter(x => x !== row.id)
            }));
        }
    }

	handleOnSelectAll = (isSelect, rows) => {
        const ids = rows.map(r => r.id);
        if (isSelect) {
            this.setState(() => ({
                selected: ids
            }));
			this.setState({
				passwordsEditBtnVariant: 'primary',
				passwordsDelBtnVariant: 'secondary',
				passwordsCopyBtnVariant: 'info',
			})
        } else {
            this.setState(() => ({
                selected: []
            }));
			this.setState({
				passwordsEditBtnVariant: 'outline-primary',
				passwordsDelBtnVariant: 'outline-secondary',
				passwordsCopyBtnVariant: 'outline-info',
			})
        }
    }

	render() {
		const { 
			logged_in, username, first_name, displayed_form, 
				isOpen, isOpenAdd, activeItem, showAlert, alertText, alertVariant} = this.state;
		
		const alertOnclick = this.state.alertAction === 'copy' ? 
			this.handleAlertConfirmCopyButton 
			: 
			this.state.alertAction === 'delete' ? 
				this.handleAlertConfirmDeleteButton 
				: 
				null
		
		return (
			<>
				<Container >
					<Row>
						<Col>
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
						</Col>
						<Col>
						{this.state.isAlertLogin && !this.state.logged_in ?
							<AlertLogin 
							closeAlertLogin = {this.closeAlertLogin} />
							: 
							null}
						</Col>
					</Row>
					<Row>
						<Col>
						{this.state.logged_in ? 
							<LoginGreeting 
								logged_in = {logged_in}
								logout = {this.handleLogout}
							/> : 
							null}
						</Col>
						<Col>
							<Alert show={showAlert} variant={alertVariant} onClose={this.closeAlert} dismissible>
								<p>
								{alertText.map((item, id) => {
								return(
									<React.Fragment key={id}>
										{item}
									</React.Fragment>
								)
								})}
								</p>
								
								{this.state.showAlertBtnConfirm ?
								<Button 
								variant={this.state.alertBtnConfirmVariant}
								disabled={this.state.alertBtnConfirmDisabled}
								onClick={alertOnclick}
								>Confirm</Button>
								:
								null
								}
							</Alert>
						</Col>
					</Row>
				</Container>
				{this.state.logged_in ?
				<Tabs defaultActiveKey="passwords" id="main-app" variant="tabs" /*variant: pills|tabs*/ >
					<Tab eventKey="passwords" title="Passwords">
						<Container>
						<Row>
							<Col xs={2}>
								<Button onClick={this.openModalAdd}>
									* New *
								</Button>
							</Col>
							<Col xs={2}>
								<Button onClick={(e) => this.handleRefresh(e)}>
									Refresh
								</Button>
							</Col>
							<Col xs={2}>
							{/* Table toggle */}
							<Button 
								onClick={this.toogleTable}
								variant={this.state.isReactTable ? 'secondary' : 'primary'}
								>
								{this.state.isReactTable ? 'Table 2' : 'Table 1'}
							</Button>
							</Col>
						</Row>
						<Row >
							{this.state.logged_in && !this.state.isReactTable ? 
							<Tbl2PasswordsCustom 
								data = {this.state.password_items}
								logout = {this.handleLogout}
								openEdit = {this.openModal}
								showAlert = {this.showAlert}
								closeAlert = {this.closeAlert}
								selected = {this.state.selected}
								handleOnSelect = {this.handleOnSelect}
								handleOnSelectAll = {this.handleOnSelectAll}
								passwordsEditBtnVariant = {this.state.passwordsEditBtnVariant}
								passwordsDelBtnVariant = {this.state.passwordsDelBtnVariant}
								passwordsCopyBtnVariant = {this.state.passwordsCopyBtnVariant}
							/>
							: 
							null}
							{this.state.logged_in && this.state.isReactTable ?
								null
							: 
								null}
						</Row>
						</Container>
					</Tab>
					<Tab eventKey="contacts" title="Contacts">
						<Container>
							<Row>
							<p><b>Contacts</b></p>
							</Row>
							<Row>
							<ContactsTable 
							contacts={this.state.contacts}
							/>
							</Row>
						</Container>
					</Tab>
					<Tab eventKey="about" title="About" >
						<p>
							Make some stuff up<br/>
							TODO: Get data from backend (admin can change)<br/>
						</p>
					</Tab>
				</Tabs>
				: null}
				
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
					isOpen={isOpenAdd}
					closeModal={this.closeModalAdd}
					handleSubmit={this.handlePasswordAdd}
				/> : 
				null}
				
				
			</>
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

		let api_calls = []
		// push idx : 0
		api_calls.push(Axios.get(base_url + 'passwords/api/v3/current_user/', {
			headers : {
				Authorization : `Token ${localStorage.getItem('token')}`
			}
		}))
		// push idx : 1
		api_calls.push(Axios.get(base_url + 'passwords/api/v3/login/history/last/', {
			headers : {
				Authorization : `Token ${localStorage.getItem('token')}`
			}
		}))

		if(this.props.logged_in) {
			
			Promise.all(api_calls).then(
				results => {
					let current_user = results[0]
					let last_login = results[1]
					
					this.setState({ 
						username: current_user.data.username, 
						first_name: current_user.data.first_name,
						last_name: current_user.data.last_name 
					});

					if(last_login.data.length > 0) {
						this.setState({last_login: last_login.data[0]})
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
				}
			).catch(err => {
				this.props.logout()
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



						// <TblPasswords 
						// 	logged_in = {logged_in}
						// 	openModal = {this.openModal}
						// 	isOpen = {isOpen}
						// 	password_items = {this.state.password_items}
						// 	activeItem={activeItem}
						// 	isPasswordShow = {this.state.isPasswordShow}
						// 	showPassword = {this.showPassword}
						// 	showPasswordClose = {this.showPasswordClose}
						// /> 

												// <TblPasswordsCustom 
						// 	data={this.state.password_items}
						// 	handlePasswordDetailChange={this.handlePasswordDetailChange}
						// 	openModal = {this.openModal}
						// 	isOpen = {isOpen}
						// 	logout = {this.handleLogout}
						// 	// activeItem={activeItem}
						// 	// handleExpandData={this.handleExpandData}
						// 	// activeItem={activeItem}
						// /> 