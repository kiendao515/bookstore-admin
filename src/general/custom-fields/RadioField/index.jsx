import React from 'react';
import PropTypes from 'prop-types';

RadioField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    text: PropTypes.string,
};

RadioField.defaultProps = {
    label: '',
    placeholder: '',
    disabled: false,
    text: '',
};

function RadioField(props) {
    const { field, form, label, placeholder, disabled, text } = props;
    const { name } = field;
    const { errors, touched } = form;
    const showError = (errors[name] && touched[name]) ?? false;

    return (
        <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-right" htmlFor={name}>{label && label}</label>
            <div className="col-lg-9 col-xl-6">
                <input
                    className={`form-control form-control-lg form-control-solid ${showError ? 'is-invalid' : ''}`}
                    id={name}
                    {...field}

                    type={type}
                    disabled={disabled}
                    placeholder={placeholder}
                />

                <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{errors[name]}</div>
                </div>

                <span className="form-text text-muted">{text}</span>
            </div>
        </div>
    );
}

export default RadioField;