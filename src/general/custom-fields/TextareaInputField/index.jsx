import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import autosize from 'autosize';

TextareaInputField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    autoHeight: PropTypes.bool,
};

TextareaInputField.defaultProps = {
    label: '',
    placeholder: '',
    disabled: false,
    autoHeight: false,
};

function TextareaInputField(props) {
    const { field, form, label, placeholder, disabled, text, autoHeight } = props;
    const { name } = field;
    const { errors, touched } = form;
    const showError = (errors[name] && touched[name]) ?? false;

    useEffect(() => {
        if (autoHeight) {
            const element = document.getElementById(name);
            if (element) {
                autosize(element);
            }
        }
    }, []);

    return (
        <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-right" htmlFor={name}>{label && label}</label>
            <div className="col-lg-9 col-xl-6">
                <textarea
                    id={name}
                    className={`form-control form-control-lg form-control-solid ${showError ? 'is-invalid' : ''}`}
                    rows="3"
                    {...field}

                    disabled={disabled}
                    placeholder={placeholder}
                >

                </textarea>

                <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{errors[name]}</div>
                </div>

                <span className="form-text text-muted">{text}</span>
            </div>
        </div>
    );
}

export default TextareaInputField;