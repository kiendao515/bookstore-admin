import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export const KTCheckboxStyle = {
    square: 'checkbox-square',
    rounded: 'checkbox-rounded',
    circle: 'checkbox-circle'
};

export const KTCheckboxType = {
    default: '',
    outline: 'checkbox-outline',
    accent: 'checkbox-accent'
};

KTCheckbox.propTypes = {
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
    style: PropTypes.oneOf(Object.values(KTCheckboxStyle)),
    type: PropTypes.oneOf(Object.values(KTCheckboxType)),
    additionalClassName: PropTypes.string,

    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    enableCheckValid: PropTypes.bool,
    isTouched: PropTypes.bool,
    isValid: PropTypes.bool,
    feedbackText: PropTypes.string,
};

KTCheckbox.defaultProps = {
    label: '',
    text: '',
    checked: false,
    disabled: false,
    large: false,
    style: KTCheckboxStyle.rounded,
    type: KTCheckboxType.default,
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
function KTCheckbox(props) {
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

    // MARK: --- Hooks ---
    useEffect(() => {

    }, []);

    return (
        <div>
            <label className={`
                checkbox mb-0
                ${disabled ? 'checkbox-disabled' : ''} 
                ${large ? 'checkbox-lg' : ''}
                ${style}
                ${type}
                ${additionalClassName}
            `}>
                <input
                    type='checkbox'
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
                enableCheckValid && isTouched && !isValid && !_.isEmpty(feedbackText) && (
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

export default KTCheckbox;