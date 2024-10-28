import autosize from 'autosize';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

BaseTextArea.propTypes = {
    name: PropTypes.string.isRequired,
    fieldProps: PropTypes.object.isRequired,
    fieldMeta: PropTypes.object.isRequired,
    fieldHelpers: PropTypes.object,

    resizable: PropTypes.bool,
    rows: PropTypes.number,
    autoHeight: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    text: PropTypes.string,
    showButtonSwitch: PropTypes.bool,
    onClickButtonSwitch: PropTypes.func,
};

BaseTextArea.defaultProps = {
    fieldHelpers: null,

    resizable: true,
    rows: 3,
    autoHeight: false,
    label: '',
    placeholder: '',
    disabled: false,
    text: '',
};

function BaseTextArea(props) {
    const { fieldProps, fieldMeta, fieldHelpers, name, label, placeholder, disabled, text, rows, autoHeight, resizable, showButtonSwitch, onClickButtonSwitch } = props;
    const { error, touched } = fieldMeta;
    const showError = error && touched;
    const { t } = useTranslation()

    useEffect(() => {
        setTimeout(() => {
            if (autoHeight) {
                const element = document.getElementById(name);
                if (element) {
                    autosize(element);
                }
            }
        }, 100);
    }, []);

    /**
     * @type {MouseEventHandler} 
     */
    function handleClickButtonSwitch(e) {
        e.preventDefault();
        if (onClickButtonSwitch) {
            onClickButtonSwitch();
        }
    }

    return (
        <div className="form-group">
            <label htmlFor={name}>{label && label}
                {
                    showButtonSwitch && (
                        <a
                            href='#'
                            className='btn btn-out btn-light-primary btn-sm d-inline mt-1'
                            onClick={handleClickButtonSwitch}
                        >
                            {t('UploadFile')}
                        </a>
                    )
                }</label>
            <div className="">
                <textarea
                    id={name}
                    className={`form-control ${showError ? 'is-invalid' : ''} ${resizable ? '' : 'resize-none'}`}
                    rows={rows}
                    placeholder={placeholder}
                    {...fieldProps} />

                {
                    showError && error.length > 0 && (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block">{error}</div>
                        </div>
                    )
                }

                <span className="form-text text-muted">{text}</span>
            </div>
        </div>
    );
}

export default BaseTextArea;