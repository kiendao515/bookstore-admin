import React from 'react';
import PropTypes from 'prop-types';
import { t } from 'i18next';
import AppConfigs from 'general/constants/AppConfigs';
import _ from 'lodash';
import { useState } from 'react';
import Utils from 'general/utils/Utils';

KTUploadFiles.propTypes = {
    name: PropTypes.string.isRequired,

    text: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onSelectedFile: PropTypes.func,
    onRemovedFile: PropTypes.func,
    enableCheckValid: PropTypes.bool,
    isTouched: PropTypes.bool,
    isValid: PropTypes.bool,
    feedbackText: PropTypes.string,
    fileName: PropTypes.string,
};

KTUploadFiles.defaultProps = {
    text: '',
    onChange: null,
    onBlur: null,
    onFocus: null,
    onSelectedFile: null,
    onRemovedFile: null,
    enableCheckValid: false,
    isValid: true,
    isTouched: false,
    feedbackText: '',
    fileName: '',
};

/**
 * 
 * @param {{
 * name: string,
 * text: string,
 * value: string,
 * onChange: function,
 * onBlur: function,
 * onFocus: function,
 * enableCheckValid: boolean,
 * isValid: boolean,
 * isTouched: boolean,
 * feedbackText: string,
 * onSelectedFile: function,
 * onRemovedFile: function,
 * fileName: string,
 * }} props 
 * @returns 
 */
function KTUploadFiles(props) {
    // MARK: --- Params ---
    const {
        name,
        text,
        value,
        onChange,
        onBlur,
        onFocus,
        onSelectedFile,
        onRemovedFile,
        enableCheckValid,
        isValid,
        isTouched,
        feedbackText,
        fileName,
    } = props;
    const [selectedFile, setSelectedFile] = useState(null);
    const isShowError = enableCheckValid && !isValid && isTouched && !_.isEmpty(feedbackText);
    // console.log({ value });

    // MARK: --- Functions ---
    function handleChange(e) {
        if (!_.isEmpty(value)) {
            URL.revokeObjectURL(value);
        }
        const files = e?.target?.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            setSelectedFile(selectedFile);
            if (onSelectedFile) {
                onSelectedFile(selectedFile);
            }
            const fileUrl = URL.createObjectURL(selectedFile);
            console.log({ fileUrl });
            if (onChange) {
                onChange(fileUrl);
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

    function handleRemoveFile() {
        if (!_.isEmpty(value)) {
            URL.revokeObjectURL(value);
        }
        if (onChange) {
            onChange('');
        }
        setSelectedFile(null);
    }

    function handleViewDocumentFile() {
        if (!_.isEmpty(value)) {
            const fullUrl = Utils.getFullUrl(value);
            Utils.openInNewTab(fullUrl);
            console.log({ fullUrl });
        }
    }

    // MARK: --- Hooks ---

    return (
        <div>
            <div className=''>
                <label className='btn btn-light-primary btn-sm mb-0' data-action='change'>
                    <div className='font-weight-bold'>{t('UploadFiles')}</div>
                    <input
                        type="file"
                        accept={AppConfigs.supportUploadDocumentFileTypes}
                        onChange={handleChange}
                        hidden
                        onClick={(e) => {
                            e.target.value = null;
                        }}
                    />
                </label>

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

                {
                    (selectedFile || value) && (
                        <div className='mt-2'>
                            <div className='rounded mt-2 d-flex align-items-center justify-content-between' style={{
                                backgroundColor: '#F3F6F9',
                                padding: '0.5rem 1rem'
                            }}>
                                <div className='d-flex flex-column'>
                                    <div className='font-size-sm font-weight-bold' style={{
                                        color: '#7E8299'
                                    }}>{selectedFile ? selectedFile.name : fileName}</div>
                                    {
                                        selectedFile && (
                                            <div className='font-size-sm font-weight-bold text-muted'>
                                                {`${Utils.fileSizeInMB(selectedFile.size)} MB`}
                                            </div>
                                        )
                                    }
                                </div>
                                <div className='d-flex align-items-center'>
                                    <span className='w-25px h-25px d-flex align-items-center justify-content-end cursor-pointer hover-opacity-80 mr-2' onClick={handleViewDocumentFile}>
                                        <i className='far fa-eye' style={{ color: '#7E8299' }} />
                                    </span>
                                    <span className='w-25px h-25px d-flex align-items-center justify-content-end cursor-pointer hover-opacity-80' onClick={handleRemoveFile}>
                                        <i className='fal fa-times' style={{ color: '#7E8299' }} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default KTUploadFiles;