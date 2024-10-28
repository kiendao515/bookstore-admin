import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import StringUtils from 'general/utils/StringUtils';

KTBSAlert.propTypes = {
    icon: PropTypes.string,
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
    additionalClassName: PropTypes.string,
    isCustom: PropTypes.bool,
    dismissing: PropTypes.bool,
};

KTBSAlert.defaultProps = {
    icon: '',
    text: '',
    additionalClassName: '',
    isCustom: false,
    dismissing: false,
};

/**
 * 
 * @param {{
 * icon: string,
 * text: string|element,
 * additionalClassName: string,
 * isCustom: boolean,
 * dismissing: boolean
 * }} props 
 * @returns 
 */
function KTBSAlert(props) {
    // MARK: --- Params ---
    const {
        text,
        icon,
        additionalClassName,
        isCustom,
        dismissing
    } = props;

    return (
        <div className={`
            alert 
            ${isCustom ? 'alert-custom' : ''} 
            ${additionalClassName}
            ${dismissing ? 'fade show' : ''}
        `}>
            {
                isCustom ? (
                    <>
                        {
                            !_.isEmpty(icon) && (
                                <div className='alert-icon'>
                                    <div className='svg-icon svg-icon-primary svg-icon-xl'>
                                        {
                                            StringUtils.checkUrlValid(icon) ? (
                                                <img
                                                    className=''
                                                    alt='icon'
                                                    src={icon}
                                                />
                                            ) : (
                                                <i className={icon} />
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }
                        <div className='alert-text'>{text}</div>
                        {
                            dismissing && (
                                <div className='alert-close'>
                                    <button
                                        type='button'
                                        className='close'
                                        data-bs-dismiss='alert'
                                        aria-label='Close'
                                    >
                                        <span aria-hidden='true'>
                                            <i className='ki ki-close' />
                                        </span>
                                    </button>
                                </div>
                            )
                        }
                    </>
                ) : (text)
            }
        </div >
    );
}

export default KTBSAlert;