import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

KTFormGroup.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
    inputName: PropTypes.string,
    inputElement: PropTypes.element,
    additionalClassName: PropTypes.string,
    additionalLabelClassName: PropTypes.string,
    labelAdditionalComponent: PropTypes.element,
};

KTFormGroup.defaultProps = {
    label: '',
    inputName: '',
    inputElement: <></>,
    additionalClassName: '',
    additionalLabelClassName: '',
    labelAdditionalComponent: null,
};

/**
 * 
 * @param {{
 * label: string|element,
 * inputName: string,
 * inputElement: element,
 * additionalClassName: string,
 * additionalLabelClassName: string,
 * labelAdditionalComponent: element,
 * }} props 
 * @returns 
 */
function KTFormGroup(props) {
    // MARK: --- Params ---
    const {
        label,
        inputName,
        inputElement,
        additionalClassName,
        additionalLabelClassName,
        labelAdditionalComponent,
    } = props;

    return (
        <div className={`form-group ${additionalClassName}`}>
            <div className='d-flex justify-content-between'>
                {
                    label && (
                        <label htmlFor={inputName} className={`${additionalLabelClassName}`}>{label}</label>
                    )
                }
                {
                    !_.isNull(labelAdditionalComponent) && (labelAdditionalComponent)
                }
            </div>
            {inputElement}
        </div>
    );
}

export default KTFormGroup;