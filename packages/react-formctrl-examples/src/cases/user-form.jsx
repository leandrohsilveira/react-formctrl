import React from 'react'

import { Route } from 'react-router-dom'

import { Form, controlledField, controlledForm } from 'react-formctrl'

import { Navbar, NavbarItem } from '../components/navbar'

let SEQUENCE = 1
const USERS = {
    '1': { name: 'Leandro', email: 'leandro.hinckel@gmail.com', password: '12345678' }
}
/**
 * 
 * 
 * USER SERVICE
 * 
 * 
 */
class UserService {

    static find(id) {
        return {
            then: (callback) => setTimeout(() => callback(USERS[id]), 1000)
        }
    }

    static create(values) {
        delete values['confirmEmail']
        delete values['confirmPassword']
        const nextId = SEQUENCE++
        USERS[nextId + ''] = values
    }

    static update(id, values) {
        delete values['confirmEmail']
        delete values['confirmPassword']
        USERS[id + ''] = values
    }

}

let InputField = ({ label, placeholder, name, type, required, onChange, onBlur, value, ctrl: { valid, invalid, dirty, errors } }) => {

    const getLabel = () => {
        return required ? `${label}*` : label
    }

    const getMessages = () => {
        if (invalid && dirty) {
            return errors.map(error => (
                <div className="invalid-feedback" key={error.key}>{error.key}</div>
            ))
        }
    }

    const getClassName = () => {
        if (valid) return 'is-valid'
        if (dirty && invalid) return 'is-invalid'
    }

    return (
        <div className="form-group">
            <label htmlFor={name}>{getLabel()}</label>
            <input className={`form-control ${getClassName()}`} id={name} name={name}
                type={type}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder || label}
                value={value} />
            {getMessages()}
        </div>
    )
}
InputField = controlledField()(InputField)

/**
 * 
 * 
 * REUSABLE USER FORM
 * 
 * 
 */
let UserForm = (props) => {
    const formName = props.form
    const user = props.user || { name: '', email: '' }
    return (
        <div className="form-container">
            <Form name={formName} onSubmit={props.onSubmit}>
                <InputField form={formName} name="name" label="Name" initialValue={user.name} required />
                <InputField form={formName} name="email" type="email" label="E-mail" initialValue={user.email} required />
                <InputField form={formName} name="confirmEmail" type="email" label="Confirm e-mail" initialValue={user.email} required match="email" />
                {!props.user && (
                    <div>
                        <InputField form={formName} name="password" type="password" label="Password" required minLength={8} />
                        <InputField form={formName} name="confirmPassword" type="password" label="Confirm password" required minLength={8} match="password" />
                    </div>
                )}
                <button className="btn btn-primary" type="submit" disabled={props.formCtrl.invalid || props.formCtrl.unchanged}>Save</button>
                <button className="btn btn-default" type="reset" disabled={props.formCtrl.unchanged}>Reset</button>
            </Form>
        </div>
    )
}
UserForm = controlledForm()(UserForm)


/**
 * 
 * 
 * REGISTER USER ROUTE
 * 
 * 
 */
function RegisterUser(props) {

    const handleSubmit = (values) => {
        UserService.create(values)
        props.history.goBack()
    }

    return <UserForm form="registerUserForm" onSubmit={handleSubmit} />
}

/**
 * 
 * 
 * UPDATE USER ROUTE
 * 
 * 
 */
class UpdateUser extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillMount() {
        const id = this.props.match.params.id
        UserService.find(id)
            .then(user => {
                this.setState({ user })
            })
    }

    handleSubmit(values) {
        const id = this.props.match.params.id
        UserService.update(id, values)
        this.props.history.goBack()
    }

    render() {
        if (this.state.user) {
            return <UserForm form="updateUserForm" onSubmit={this.handleSubmit} user={this.state.user} />
        } else {
            return <span>Loading user data...</span>
        }
    }

}


/**
 * 
 * 
 * USERS LIST ROUTE
 * 
 * 
 */
function UserList(props) {
    const usersIds = Object.keys(USERS)
    const onEdit = id => props.history.push(`${props.match.path}/edit/${id}`)
    let content = (
        <tr><td colSpan={4}>Users list is empty</td></tr>
    )
    if (usersIds.length > 0) {
        content = usersIds.map(userId => (
            <tr key={userId}>
                <th scope="row">{userId}</th>
                <td>{USERS[userId].name}</td>
                <td>{USERS[userId].email}</td>
                <td>
                    <button className="btn btn-primary btn-sm" type="button" onClick={() => onEdit(userId)}>Edit</button>
                </td>
            </tr>
        ))
    }


    return (
        <table className="table table-responsive">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>E-mail</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {content}
            </tbody>
        </table>
    )
}

function Menu({ path }) {
    return (
        <Navbar id="userFormNavbar" className="navbar-dark bg-dark" title='user-crud-example'>
            <NavbarItem to={`${path}`}>User List</NavbarItem>
            <NavbarItem to={`${path}/register`}>Register</NavbarItem>
        </Navbar>
    )
}

/**
 * 
 * 
 * THE APP
 * 
 * 
 */
export function UserFormApp(props) {
    const path = props.match.path
    return (
        <div className="card">
            <Menu path={path}></Menu>
            <div className="card-body">
                <div style={{ marginTop: 10 }}>
                    <Route path={`${path}`} render={(props) => (
                        <div>
                            <Route path={`${path}`} exact component={UserList}></Route>
                            <Route path={`${path}/register`} exact component={RegisterUser}></Route>
                            <Route path={`${path}/edit/:id`} exact component={UpdateUser}></Route>
                        </div>
                    )}>
                    </Route>
                </div>
            </div>
        </div>
    )
}