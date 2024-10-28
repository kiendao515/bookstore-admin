import autosize from 'autosize';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

require("bootstrap-maxlength");

KTFormTextArea.propTypes = {
    // required
    name: PropTypes.string.isRequired,

    // optional
    value: PropTypes.string,
    placeholder: PropTypes.string,
    text: PropTypes.string,
    disabled: PropTypes.bool,
    rows: PropTypes.number,
    readonly: PropTypes.bool,
    autoHeight: PropTypes.bool,
    resizable: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    enableCheckValid: PropTypes.bool,
    showValidState: PropTypes.bool,
    isTouched: PropTypes.bool,
    isValid: PropTypes.bool,
    feedbackText: PropTypes.string,

    // max length
    maxLength: PropTypes.number,
    maxLengthWarningClass: PropTypes.string,
    maxLengthReachedClass: PropTypes.string,
    maxLengthCustomSeparator: PropTypes.string,
    maxLengthCustomPreText: PropTypes.string,
    maxLengthCustomPostText: PropTypes.string,
};

KTFormTextArea.defaultProps = {
    value: '',
    placeholder: '',
    text: '',
    disabled: false,
    rows: 3,
    readonly: false,
    autoHeight: false,
    resizable: true,
    onChange: null,
    onBlur: null,
    onFocus: null,
    enableCheckValid: false,
    showValidState: false,
    isValid: true,
    isTouched: false,
    feedbackText: '',

    // max length
    maxLength: 0,
    maxLengthWarningClass: 'label label-danger label-rounded label-inline',
    maxLengthReachedClass: 'label label-primary label-rounded label-inline',
    maxLengthCustomSeparator: '/',
    maxLengthCustomPreText: '',
    maxLengthCustomPostText: '',
};

/**
 * 
 * @param {{
 * name: string,
 * value: string,
 * placeholder: string,
 * text: string,
 * disabled: boolean,
 * rows: number,
 * readonly: boolean,
 * autoHeight: boolean,
 * resizable: boolean,
 * onChange: function,
 * onBlur: function,
 * onFocus: function,
 * enableCheckValid: boolean,
 * showValidState: boolean,
 * isValid: boolean,
 * isTouched: boolean,
 * feedbackText: string,
 * maxLength: number,
 * maxLengthWarningClass: string,
 * maxLengthReachedClass: string,
 * maxLengthCustomSeparator: string,
 * maxLengthCustomPreText: string,
 * maxLengthCustomPostText: string,
 * }} props 
 * @returns 
 */
function KTFormTextArea(props) {
    // MARK: --- Params ---
    const {
        name,

        value,
        placeholder,
        text,
        disabled,
        rows,
        readonly,
        autoHeight,
        resizable,
        onChange,
        onBlur,
        onFocus,
        enableCheckValid,
        showValidState,
        isValid,
        isTouched,
        feedbackText,

        // max length
        maxLength,
        maxLengthWarningClass,
        maxLengthReachedClass,
        maxLengthCustomSeparator,
        maxLengthCustomPreText,
        maxLengthCustomPostText,
    } = props;

    // MARK: --- Functions ---
    function handleChange(targetValue) {
        if (onChange) {
            onChange(targetValue);
        }
    }

    function handleBlur() {
        if (onBlur) {
            onBlur();
        }
    }

    function handleFocus() {
        if (onFocus) {
            onFocus();
        }
    }

    // MARK: --- Hooks ---
    useEffect(() => {
        if (autoHeight) {
            const el = document.getElementById(name);
            if (el) {
                autosize(el);
            }
        }

        // maxlength
        if (maxLength > 0) {
            $(`#${name}`).maxlength({
                warningClass: maxLengthWarningClass,
                limitReachedClass: maxLengthReachedClass,
                separator: maxLengthCustomSeparator,
                preText: maxLengthCustomPreText,
                postText: maxLengthCustomPostText,
            });
        }
    }, []);

    return (
        <div>
            <textarea
                className={`
                    form-control 
                    ${resizable ? '' : 'resize-none'}
                    ${(enableCheckValid && isTouched) ? (`${isValid ? `${showValidState ? 'is-valid' : ''}` : 'is-invalid'}`) : ''}
                `}
                id={name}
                name={name}
                rows={rows}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readonly}
                maxLength={maxLength > 0 ? `${maxLength}` : ''}
                onChange={(e) => {
                    const targetValue = e.target.value;
                    handleChange(targetValue);
                }}
                onBlur={handleBlur}
                onFocus={handleFocus}
            ></textarea>
            {
                enableCheckValid && !isValid && isTouched && !_.isEmpty(feedbackText) && (
                    <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{feedbackText}</div>
                    </div>
                )
            }
            {
                !_.isEmpty(text) && (
                    <span className='form-text text-muted'>{text}</span>
                )
            }
        </div>
    );
}

export default KTFormTextArea;