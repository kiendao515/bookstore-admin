import React from 'react';
import PropTypes from 'prop-types';

CheckboxField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    label: PropTypes.string,
    disabled: PropTypes.bool,
    text: PropTypes.string,
};

CheckboxField.defaultProps = {
    label: '',
    disabled: false,
    text: '',
};

function CheckboxField(props) {

    const { field, form, label, disabled, text } = props;
    const { name } = field;
    const { errors, touched } = form;
    const showError = (errors[name] && touched[name]) ?? false;

    return (
        <label className={`checkbox ${disabled ? 'checkbox-disabled' : ''}`}>
            <input
                type="checkbox"
                id={name}
                {...field}

                disabled={disabled}
            />
            <span></span>
            {label && label}
        </label>
    );
}

export default CheckboxField;