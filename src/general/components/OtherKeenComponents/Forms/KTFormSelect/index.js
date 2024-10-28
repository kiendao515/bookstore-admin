import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

export const KTFormSelectSize = {
    default: '',
    large: 'form-control-lg',
    small: 'form-control-sm',
};

KTFormSelect.propTypes = {
    // required
    name: PropTypes.string.isRequired,

    // optional
    options: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.string,
    })),
    value: PropTypes.string,
    text: PropTypes.string,
    disabled: PropTypes.bool,
    isCustom: PropTypes.bool,
    size: PropTypes.oneOf(Object.values(KTFormSelectSize)),
    multiple: PropTypes.bool,
    rows: PropTypes.number,
    showValidState: PropTypes.bool,

    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    enableCheckValid: PropTypes.bool,
    isTouched: PropTypes.bool,
    isValid: PropTypes.bool,
    feedbackText: PropTypes.string,
};

KTFormSelect.defaultProps = {
    options: [],
    value: '',
    text: '',
    disabled: false,
    isCustom: false,
    size: KTFormSelectSize.default,
    multiple: false,
    rows: 1,
    showValidState: false,

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
 * options: {name: string, value: string}[]
 * name: string,
 * value: string,
 * text: string,
 * disabled: boolean,
 * isCustom: boolean,
 * size: string,
 * multiple: boolean,
 * rows: number,
 * showValidState: boolean,
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
function KTFormSelect(props) {
    // MARK: --- Params ---
    const {
        name,

        options,
        value,
        text,
        disabled,
        isCustom,
        size,
        multiple,
        rows,
        showValidState,

        onChange,
        onBlur,
        onFocus,
        enableCheckValid,
        isValid,
        isTouched,
        feedbackText,
    } = props;
    const { t } = useTranslation();

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

    return (
        <div>
            <select
                id={name}
                name={name}
                className={`
                    form-control
                    ${isCustom ? 'custom-select shadow-none' : `form-select ${size}`}
                    ${(enableCheckValid && isTouched) ? (`${isValid ? `${showValidState ? 'is-valid' : ''}` : 'is-invalid'}`) : ''}
                `}
                value={value}
                disabled={disabled}
                multiple={multiple}
                size={multiple ? rows : ''}
                onChange={(e) => {
                    handleChange(e.target.value);
                }}
                onBlur={handleBlur}
                onFocus={handleFocus}
            >
                {
                    options.map((item, index) => {
                        return (
                            <option
                                key={index}
                                value={item.value}
                            >
                                {t(item.name)}
                            </option>
                        )
                    })
                }
            </select>
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

export default KTFormSelect;