import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

BaseTextField.propTypes = {
    name: PropTypes.string.isRequired,
    fieldProps: PropTypes.object,
    fieldMeta: PropTypes.object,
    fieldHelper: PropTypes.object,

    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    text: PropTypes.string,
    className: PropTypes.string,
    spellCheck: PropTypes.bool,
};

BaseTextField.defaultProps = {
    type: "text",
    label: "",
    placeholder: "",
    disabled: false,
    text: "",
    spellCheck: false,

    fieldProps: {},
    fieldHelper: {},
    fieldMeta: {},

    className: 'form-group',
};

function BaseTextField(props) {
    // MARK: --- Params ---
    const { name, fieldProps, fieldHelper, fieldMeta, type, label, placeholder, disabled, text, className, spellCheck } = props;
    const { error, touched } = fieldMeta;
    const isError = error && touched;

    return (
        <div className='BaseTextField'>
            <div className={className}>
                {
                    label && (<label htmlFor={name}>{label}</label>)
                }
                <input
                    className={`form-control ${isError && 'is-invalid'}`}
                    id={name}
                    disabled={disabled}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    spellCheck={spellCheck}
                    {...fieldProps}
                />
                {
                    text.length > 0 && (
                        <span className='form-text text-muted'>{text}</span>
                    )
                }
                {
                    isError && (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block">{error}</div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default BaseTextField;