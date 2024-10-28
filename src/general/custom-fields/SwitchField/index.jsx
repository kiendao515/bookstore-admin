import React from 'react';
import PropTypes from 'prop-types';

SwitchField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    label: PropTypes.string,
    disabled: PropTypes.bool,
    text: PropTypes.string,
};

SwitchField.defaultProps = {
    label: '',
    disabled: false,
    text: '',
};

function SwitchField(props) {
    const { field, form, label, disabled, text } = props;
    const { name, value } = field;
    const { errors, touched } = form;
    const showError = (errors[name] && touched[name]) ?? false;

    function handleSwitchValueChanged(e) {
        const changeEvent = {
            target: {
                name: name,
                value: e.target.value
            }
        };
        field.onChange(changeEvent);
    }

    return (
        <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-right" htmlFor={name}>{label && label}</label>
            <div className="col-lg-9 col-xl-6 d-flex align-items-center">
                <span className="switch switch-sm">
                    <label>
                        <input
                            type="checkbox"
                            id={name}
                            {...field}

                            checked={value}
                            // onChange={handleSwitchValueChanged}
                            // defaultChecked={value}
                            disabled={disabled}
                        />
                        <span></span>
                    </label>
                </span>

                <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{errors[name]}</div>
                </div>

                <span className="form-text text-muted">{text}</span>
            </div>
        </div>
    );
}

export default SwitchField;