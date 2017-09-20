import React from 'react'

import {Route, NavLink} from 'react-router-dom'

import {Field, Form, FormControl} from 'react-formctrl'

let SEQUENCE = 1
const USERS = {
    '1': {name: 'Leandro', email: 'leandro.hinckel@gmail.com', password: '12345678'}
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
        USERS[nextId] = values
    }

    static update(id, values) {
        delete values['confirmEmail']
        delete values['confirmPassword']
        USERS[id] = values
    }

}


/**
 * 
 * 
 * FIELD WRAPPER
 * 
 * 
 */
function MyInput({label, placeholder, name, type, required,  onChange, onBlur, value, ctrl: {invalid, dirty, errors}}) {

    const getLabel = () => {
        return required ? `${label}*` : label
    }

    const getMessages = () => {
        if(invalid && dirty) {
            return (
                <ul>
                    {errors.map(error => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
            )
        }
    }

    return (
        <div>
            <div>
                <label htmlFor={name}>{getLabel()}</label>
            </div>
            <div>
                <input id={name} name={name} 
                    type={type} 
                    onChange={onChange} 
                    onBlur={onBlur}
                    placeholder={placeholder || label}
                    value={value} />
            </div>
            {getMessages()}
        </div>
    );
}


/**
 * 
 * 
 * INPUT FIELD
 * 
 * 
 */
function InputField({
    label, 
    placeholder, 
    form, 
    name, 
    type, 
    initialValue, 
    match, 
    required, 
    pattern, 
    integer, 
    minLength}) {
    return (
        <Field form={form} 
                name={name} 
                type={type} 
                initialValue={initialValue} 
                minLength={minLength}
                match={match}
                required={required} 
                integer={integer}
                pattern={pattern}>
            <MyInput label={label} placeholder={placeholder} />
        </Field>
    )
}


/**
 * 
 * 
 * REUSABLE USER FORM
 * 
 * 
 */
function UserForm(props) {
    const formName = props.formCtrl.formName
    const user = props.user || {name: '', email: ''}
    return (
        <div className="form-container">
            <Form name={formName} onSubmit={props.onSubmit}>
                <div className="fieldset">
                    <div className="fields-container">
                        <InputField form={formName} name="name" label="Name" initialValue={user.name} required />
                        <InputField form={formName} name="email" type="email" label="E-mail" initialValue={user.email} required />
                        <InputField form={formName} name="confirmEmail" type="email" label="Confirm e-mail" initialValue={user.email} required match="email" />
                        <InputField form={formName} name="password" type="password" label="Password" required minLength={8} />
                        <InputField form={formName} name="confirmPassword" type="password" label="Confirm password" required minLength={8} match="password" />
                    </div>
                    <div className="buttons-container">
                        <button type="submit" disabled={props.formCtrl.invalid || props.formCtrl.unchanged}>Save</button>
                        <button type="reset" disabled={props.formCtrl.unchanged}>Reset</button>
                    </div>
                </div>
            </Form>
        </div>
    )
}


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

    return (
        <FormControl name="registerUserForm">
            <UserForm onSubmit={handleSubmit} />
        </FormControl>
    )
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
                        this.setState({user})
                    })
    }

    handleSubmit(values) {
        const id = this.props.match.params.id
        UserService.update(id, values)
        this.props.history.goBack()
    }

    render() {
        if(this.state.user) {
            return (
                <FormControl name="updateUserForm">
                    <UserForm onSubmit={this.handleSubmit} user={this.state.user} />
                </FormControl>
            )
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

    if(usersIds.length > 0) {
        return (
            <ul>
                {usersIds.map(userId => (
                    <li key={userId}>
                        <span>{USERS[userId].name} - {USERS[userId].email}</span>
                        <button type="button" onClick={() => onEdit(userId)}>Edit</button>
                    </li>
                ))}
            </ul>
        )
    } else {
        return <span>Users list is empty</span>
    }
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
        <div>
            <div className="menu">
                <NavLink activeClassName="active" exact to={`${path}`}>User List</NavLink>
                <NavLink activeClassName="active" exact to={`${path}/register`}>Register</NavLink>
            </div>
            <div style={{marginTop: 10}}>
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
    )
}