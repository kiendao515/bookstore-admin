import _ from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';

export const KTSwitchSize = {
    default: '',
    lg: 'switch-lg',
    sm: 'switch-sm'
};

export const KTSwitchType = {
    default: '',
    outline: 'switch-outline',
};

KTSwitch.propTypes = {
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
    showIcon: PropTypes.bool,
    size: PropTypes.oneOf(Object.values(KTSwitchSize)),
    type: PropTypes.oneOf(Object.values(KTSwitchType)),
    additionalClassName: PropTypes.string,
    usingFormik: PropTypes.bool,

    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    enableCheckValid: PropTypes.bool,
    isTouched: PropTypes.bool,
    isValid: PropTypes.bool,
    feedbackText: PropTypes.string,
};

KTSwitch.defaultProps = {
    label: '',
    text: '',
    checked: false,
    disabled: false,
    showIcon: false,
    size: KTSwitchSize.default,
    type: KTSwitchType.default,
    additionalClassName: '',
    usingFormik: true,

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
 * showIcon: boolean,
 * size: string,
 * additionalClassName: string,
 * usingFormik: boolean,
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
function KTSwitch(props) {
    // MARK: --- Params ---
    const {
        name,
        label,
        text,
        checked,
        disabled,
        showIcon,
        size,
        type,
        additionalClassName,
        usingFormik,

        onChange,
        onBlur,
        onFocus,
        enableCheckValid,
        isValid,
        isTouched,
        feedbackText,
    } = props;
    const [isChecked, setIsChecked] = useState(checked);

    // MARK: --- Functions ---
    function handleChange(e) {
        if (usingFormik) {
            const newCheckedState = !checked;
            if (onChange) {
                onChange(newCheckedState);
            }
        } else {
            const newCheckedState = !isChecked;
            setIsChecked(newCheckedState);
            if (onChange) {
                onChange(newCheckedState);
            }
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
        <div className='d-flex align-items-center'>
            {
                !_.isEmpty(label) && (
                    <label className='mr-4 mb-0'>{label}</label>
                )
            }
            <div>
                <span className={`
                switch ${showIcon ? 'switch-icon' : ''}
                ${size}
                ${type}
                ${additionalClassName}`
                }>
                    <label>
                        <input
                            type='checkbox'
                            name={name}
                            disabled={disabled}
                            checked={usingFormik ? checked : isChecked}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                        <span></span>
                    </label>
                </span>

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
        </div>
    );
}

export default KTSwitch;