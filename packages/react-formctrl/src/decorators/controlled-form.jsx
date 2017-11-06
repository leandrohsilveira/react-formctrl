import React from 'react';

import { FormControl } from '../form/form'

export function controlledForm(options) {
    return (Component) => {
        return class ControlledForm extends React.Component {
            render() {
                const { form } = this.props;
                return (
                    <FormControl form={form}>
                        <Component {...this.props} />
                    </FormControl>
                );
            }
        };
    };
}