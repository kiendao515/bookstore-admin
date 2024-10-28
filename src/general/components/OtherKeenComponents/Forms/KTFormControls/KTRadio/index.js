import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export const KTRadioStyle = {
    default: '',
    square: 'radio-square',
    rounded: 'radio-rounded'
};

export const KTRadioType = {
    default: '',
    outline: 'radio-outline',
    accent: 'radio-accent'
};

KTRadio.propTypes = {
    // required
    name: PropTypes.string.isRequired,

    // optional
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    large: PropTypes.bool,
    style: PropTypes.oneOf(Object.values(KTRadioStyle)),
    type: PropTypes.oneOf(Object.values(KTRadioType)),
    additionalClassName: PropTypes.string,

    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    enableCheckValid: PropTypes.bool,
    isTouched: PropTypes.bool,
    isValid: PropTypes.bool,
    feedbackText: PropTypes.string,
};

KTRadio.defaultProps = {
    label: '',
    text: '',
    checked: false,
    disabled: false,
    large: false,
    style: KTRadioStyle.default,
    type: KTRadioType.default,
    additionalClassName: '',

    onChange: null,
    onBlur: null,
    onFocus: null,
    enableCheckValid: false,
    isValid: true,
    isTouched: false,
    feedbackText: '',
};

/**
 * 
 * @param {{
 * name: string,
 * label: string|element, 
 * text: string|element,
 * checked: boolean,
 * disabled: boolean,
 * large: boolean,
 * style: string,
 * type: string,
 * additionalClassName: string,
 * onChange: function,
 * onBlur: function,
 * onFocus: function,
 * enableCheckValid: boolean,
 * isValid: boolean,
 * isTouched: boolean,
 * feedbackText: string,
 * }} props 
 * @returns 
 */
function KTRadio(props) {
    // MARK: --- Params ---
    const {
        name,

        label,
        text,
        checked,
        disabled,
        large,
        style,
        type,
        additionalClassName,

        onChange,
        onBlur,
        onFocus,
        enableCheckValid,
        isValid,
        isTouched,
        feedbackText,
    } = props;

    // MARK: --- Functions ---
    function handleChange(e) {
        const newCheckedState = !checked;
        console.log({ newCheckedState });
        // setChecked(newCheckedState);
        if (onChange) {
            onChange(newCheckedState);
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

    return (
        <div>
            <label className={`
                radio
                ${disabled ? 'radio-disabled' : ''}
                ${large ? 'radio-lg' : ''}
                ${style}
                ${type}
                ${additionalClassName}
            `}>
                <input
                    type='radio'
                    name={name}
                    disabled={disabled}
                    checked={checked}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                />
                <span></span>
                {label}
            </label>

            {
                enableCheckValid && !_.isEmpty(feedbackText) && (
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

export default KTRadio;