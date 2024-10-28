import PropTypes from 'prop-types';
import React, { useState } from 'react';
import './style.scss';

BigInputField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    type: PropTypes.string,
    label: PropTypes.string,
    appendLabelElement: PropTypes.element,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
};

BigInputField.defaultProps = {
    type: 'text',
    label: '',
    appendLabelElement: <></>,
    placeholder: '',
    disabled: false
};

function BigInputField(props) {
    const { field, form, type, label, placeholder, disabled, appendLabelElement } = props;
    const { name } = field;
    const { errors, touched } = form;
    const showError = (errors[name] && touched[name]) ?? false;

    const [currentType, setCurrentType] = useState(type)

    function handleShowPass() {
        if (currentType === 'password') {
            setCurrentType('text');
        } else if (currentType === 'text') {
            setCurrentType('password');
        }
    }

    return (
        <div className="form-group fv-plugins-icon-container">
            <div className='d-flex flex-row align-items-center justify-content-between'>
                <label className="font-size-h6 font-weight-bolder text-white mb-2" htmlFor={name}>{label}</label>
                {appendLabelElement && appendLabelElement}
            </div>

            <div className='BigInputField'>
                <input
                    className={`form-control h-auto py-6 rounded-lg ${showError ? 'is-invalid' : (touched[name] ? '' : '')}`}
                    id={name}
                    {...field}

                    type={currentType}
                    disabled={disabled}
                    placeholder={placeholder}
                    autoComplete="new-password"
                />
                {
                    (type === 'password' && field.value.length != 0)
                    && <div
                        className="BigInputField_Eye d-flex align-items-center justify-content-center cursor-pointer"
                        onClick={handleShowPass}
                    >
                        <i className={`fas fa-eye${currentType === 'text' ? '-slash' : ''}`}></i>
                    </div>
                }
            </div>

            <div className="fv-plugins-message-container">
                <div className="fv-help-block text-white">{errors[name]}</div>
            </div>
        </div>
    );
}

export default BigInputField;