import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
//sonnh fix import error
const jQuery=require('jquery')
const moment=require('moment')
window.jQuery=jQuery
window.moment=moment
//
require('tempusdominus-bootstrap-4');

DateTimePickerField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    text: PropTypes.string,
    onlyDate: PropTypes.bool,
};

DateTimePickerField.defaultProps = {
    label: '',
    placeholder: '',
    disabled: false,
    text: '',
    onlyDate: false,
}

function DateTimePickerField(props) {
    const { field, form, label, placeholder, disabled, text, onlyDate } = props;
    const { name, value } = field;
    const { errors, touched } = form;
    const showError = (errors[name] && touched[name]) ?? false;

    useEffect(() => {
        $("#kt_datetimepicker_1").datetimepicker({
            locale: 'vi',
            format: onlyDate ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm',
            icons: {
                time: 'fal fa-clock',
                date: 'fal fa-calender-alt',
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            }
        });
    }, []);

    return (
        <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-right" htmlFor={name}>{label && label}</label>
            <div className="col-lg-9 col-xl-6">
                <div className="input-group date" id="kt_datetimepicker_1" data-target-input="nearest">
                    <input
                        className={`form-control form-control-lg form-control-solid datetimepicker-input ${showError ? 'is-invalid' : ''}`}
                        id={name}
                        {...field}

                        type="text"
                        placeholder={placeholder}
                        disabled={disabled}
                        data-target="#kt_datetimepicker_1"
                    />
                    <div className="input-group-append" data-target="#kt_datetimepicker_1" data-toggle="datetimepicker">
                        <span className="input-group-text border-0">
                            <i className="fal fa-calendar-alt"></i>
                        </span>
                    </div>
                </div>

                <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{errors[name]}</div>
                </div>

                <span className="form-text text-muted">{text}</span>
            </div>
        </div>
    );
}

export default DateTimePickerField;