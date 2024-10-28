import Utils from 'general/utils/Utils';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import KTTooltip from '../../KTTooltip';

KTImageInput.propTypes = {
    // required
    name: PropTypes.string.isRequired,

    // optional
    value: PropTypes.string,
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
    outlineStyle: PropTypes.bool,
    circleStyle: PropTypes.bool,
    acceptImageTypes: PropTypes.arrayOf(PropTypes.string),
    defaultImage: PropTypes.string,
    editable: PropTypes.bool,
    onSelectedFile: PropTypes.func,
    onRemovedFile: PropTypes.func,

    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    enableCheckValid: PropTypes.bool,
    isTouched: PropTypes.bool,
    isValid: PropTypes.bool,
    feedbackText: PropTypes.string,
};

KTImageInput.defaultProps = {
    value: '',
    text: '',
    outlineStyle: true,
    circleStyle: false,
    acceptImageTypes: [],
    defaultImage: '',
    editable: false,
    onSelectedFile: null,
    onRemovedFile: null,

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
 * value: string,
 * text: string | element,
 * outlineStyle: boolean,
 * circleStyle: boolean,
 * acceptImageTypes: string[],
 * editable: boolean,
 * onChange: function,
 * onBlur: function,
 * onFocus: function,
 * enableCheckValid: boolean,
 * isValid: boolean,
 * isTouched: boolean,
 * feedbackText: string,
 * onSelectedFile: function,
 * onRemovedFile: function,
 * }} props 
 * @returns 
 */
function KTImageInput(props) {
    // MARK: --- Params ---
    const {
        name,

        value,
        text,
        outlineStyle,
        circleStyle,
        acceptImageTypes,
        defaultImage,
        editable,
        onSelectedFile,
        onRemovedFile,

        onChange,
        onBlur,
        onFocus,
        enableCheckValid,
        isValid,
        isTouched,
        feedbackText,
    } = props;
    const { t } = useTranslation();

    const isShowError = enableCheckValid && !isValid && isTouched && !_.isEmpty(feedbackText);

    // MARK: --- Functions ---
    function handleChange(e) {
        if (!_.isEmpty(value)) {
            URL.revokeObjectURL(value);
        }
        const images = e.target.files;
        if (images && images.length > 0) {
            const selectedImage = images[0];
            const imageInputValue = URL.createObjectURL(selectedImage);
            if (onChange) {
                onChange(imageInputValue);
            }
            if (onSelectedFile) {
                onSelectedFile(selectedImage);
            }
        }
        if (onFocus) {
            onFocus();
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

    function handleRemoveImage() {
        if (!_.isEmpty(value)) {
            URL.revokeObjectURL(value);
        }
        if (onChange) {
            onChange('');
        }
        if (onRemovedFile) {
            onRemovedFile();
        }
    }

    // MARK: --- Hooks ---

    return (
        <div>
            <div className={`
                image-input 
                ${outlineStyle ? 'image-input-outline' : ''}
                ${circleStyle ? 'image-input-circle' : ''}
            `}>
                {/* wrapper */}
                <div
                    className={`image-input-wrapper ${isShowError ? 'border-1 border-danger' : ''}`}
                    style={{
                        backgroundImage: `url(${!_.isEmpty(value) ? Utils.getFullUrl(value) : defaultImage})`
                    }}
                >
                </div>
                <KTTooltip text={t('Change')}>
                    <label className='btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow' data-action='change'>
                        <i className='fa fa-pen icon-sm text-muted' />

                        <input
                            type='file'
                            name={name}
                            id={name}
                            accept={_.join(acceptImageTypes, ', ')}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                        />
                        <input type='hidden' />
                    </label>
                </KTTooltip>

                {/* editable */}
                {
                    editable && !_.isEmpty(value) && (
                        <KTTooltip text={t('Remove')}>
                            <span
                                className='btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow'
                                data-action='remove'
                                onClick={handleRemoveImage}
                            >
                                <i className='ki ki-bold-close icon-xs text-muted' />
                            </span>
                        </KTTooltip>
                    )
                }
            </div>

            {
                isShowError && (
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

export default KTImageInput;