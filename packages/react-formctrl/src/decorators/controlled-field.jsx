import React from 'react'

import { Field } from '../field/field'

export function controlledField() {
    return (Component) => {
        return class ControlledField extends React.Component {
            render() {
                return (
                    <Field {...this.props}>
                        <Component {...this.props} />
                    </Field>
                );
            }
        };
    };
}