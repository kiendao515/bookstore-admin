import React from 'react';
import PropTypes from 'prop-types';
import { t } from 'i18next';
import AppConfigs from 'general/constants/AppConfigs';
import _ from 'lodash';
import Utils from 'general/utils/Utils';

KTUploadFiles.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string,
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string, // URL ảnh đã lưu
      PropTypes.object, // File object (ảnh mới)
    ])
  ),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onSelectedFile: PropTypes.func,
  onRemovedFile: PropTypes.func,
  enableCheckValid: PropTypes.bool,
  isTouched: PropTypes.bool,
  isValid: PropTypes.bool,
  feedbackText: PropTypes.string,
};

KTUploadFiles.defaultProps = {
  text: '',
  value: [],
  onChange: null,
  onBlur: null,
  onFocus: null,
  onSelectedFile: null,
  onRemovedFile: null,
  enableCheckValid: false,
  isValid: true,
  isTouched: false,
  feedbackText: '',
};

/**
 * Component KTUploadFiles
 */
function KTUploadFiles(props) {
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
  } = props;

  const isShowError = enableCheckValid && !isValid && isTouched && !_.isEmpty(feedbackText);

  function handleFileChange(e) {
    const files = e?.target?.files;
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files);
      if (onSelectedFile) {
        onSelectedFile(selectedFiles);
      }
      const updatedValue = [...(value || []), ...selectedFiles];
      if (onChange) {
        onChange(updatedValue);
      }
    }

    if (onFocus) {
      onFocus();
    }
  }
  function handleRemove(index) {
    const updatedValue = value.filter((_, i) => i !== index);
    if (onRemovedFile) {
      onRemovedFile(index);
    }
    if (onChange) {
      onChange(updatedValue);
    }
  }

  return (
    <div>
      {/* Nút Upload */}
      <label className="btn btn-light-primary btn-sm mb-0" data-action="change">
        <div className="font-weight-bold">{t('Upload ảnh nội dung')}</div>
        <input
          type="file"
          multiple
          accept={AppConfigs.supportUploadDocumentFileTypes}
          onChange={handleFileChange}
          hidden
          onClick={(e) => {
            e.target.value = null; // Reset input để chọn lại cùng file
          }}
        />
      </label>

      {/* Hiển thị lỗi */}
      {isShowError && (
        <div className="fv-plugins-message-container">
          <div className="fv-help-block">{feedbackText}</div>
        </div>
      )}

      {/* Hiển thị text hướng dẫn */}
      {!_.isEmpty(text) && <span className="form-text text-muted">{text}</span>}

      {/* Hiển thị danh sách ảnh */}
      <div className="mt-2">
        {value?.map((file, index) => (
          <div
            key={index}
            className="rounded mt-2 d-flex align-items-center justify-content-between"
            style={{
              backgroundColor: '#F3F6F9',
              padding: '0.5rem 1rem',
            }}
          >
            {/* Hiển thị ảnh */}
            <div className="d-flex align-items-center">
              <img
                src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                alt={`Content image ${index}`}
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'cover',
                  marginRight: '10px',
                }}
              />
              <div className="font-size-sm font-weight-bold">
                {typeof file === 'string' ? 'Uploaded' : file.name}
              </div>
            </div>

            {/* Nút xóa ảnh */}
            <span
              className="w-25px h-25px d-flex align-items-center justify-content-end cursor-pointer hover-opacity-80"
              onClick={() => handleRemove(index)}
            >
              <i className="fal fa-times" style={{ color: '#7E8299' }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KTUploadFiles;
