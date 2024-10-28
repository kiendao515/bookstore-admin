import React from 'react';
import PropTypes from 'prop-types';

SelectField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.array,
    text: PropTypes.string,
};

SelectField.defaultProps = {
    label: '',
    placeholder: '',
    disabled: false,
    options: [],
    text: '',
};

function SelectField(props) {
    const { field, form, label, placeholder, disabled, options, text } = props;
    const { name, value } = field;
    const { errors, touched } = form;
    const showError = (errors[name] && touched[name]) ?? false;

    const customStyles = {

    };

    const handleSelectedOptionChange = (e) => {
        const selectedValue = e.target.value;

        const changeEvent = {
            target: {
                name,
                value: selectedValue
            }
        };
        field.onChange(changeEvent);
    }

    return (
        <div className="form-group row">
            {label && (<label className="col-form-label text-right col-lg-3 col-sm-12">{label}</label>)}
            <div className="col-lg-9 col-xl-6">
                <select
                    id={name}
                    {...field}
                    // value={selectedOption}
                    onChange={handleSelectedOptionChange}

                    placeholder={placeholder}
                    disabled={disabled}
                    options={options}

                    className={`form-control form-control-solid ${showError ? 'is-invalid' : ''}`}
                >
                    {options.map((item, index) => {
                        return (
                            <option
                                key={index}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        );
                    })}
                </select>
                <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{errors[name]}</div>
                </div>
                <span className="form-text text-muted">{text}</span>
            </div>
        </div>
    );
}

export default SelectField;