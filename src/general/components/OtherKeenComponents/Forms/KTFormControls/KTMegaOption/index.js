import React from 'react';
import PropTypes from 'prop-types';

export const KTMegaOptionControlType = {
    radio: 'radio',
    checkbox: 'checkbox',
};

KTMegaOption.propTypes = {
    // required
    name: PropTypes.string.isRequired,

    // optional
    noBorder: PropTypes.bool,
    optionControlType: PropTypes.oneOf(Object.values(KTMegaOptionControlType)),
    labelTitle: PropTypes.string,
    labelFocus: PropTypes.string,
    body: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
};

KTMegaOption.defaultProps = {
    noBorder: false,
    optionControlType: KTMegaOptionControlType.radio,
    labelTitle: '',
    labelFocus: '',
    body: '',
};

/**
 * 
 * @param {{
 * name: string,
 * noBorder: boolean,
 * optionControlType: string,
 * labelTitle: string,
 * labelFocus: string,
 * body: string|element
 * }} props 
 * @returns 
 */
function KTMegaOption(props) {
    // MARK: --- Params ---
    const {
        name,
        noBorder,
        optionControlType,
        labelTitle,
        labelFocus,
        body
    } = props;

    // MARK: --- Functions ---

    return (
        <div>
            <label className={`option ${noBorder ? 'option-plain' : ''}`}>
                {/* option control */}
                <span className='option-control'>
                    <span className={optionControlType}>
                        <input
                            type={optionControlType}
                            name={name}
                        />
                        <span></span>
                    </span>
                </span>

                {/* option label */}
                <span className='option-label'>
                    {/* head */}
                    <span className='option-head'>
                        {/* head title */}
                        <span className='option-title'>
                            {labelTitle}
                        </span>
                        {/* head focus */}
                        <span className='option-focus'>
                            {labelFocus}
                        </span>
                    </span>
                    {/* body */}
                    <span className='option-body'>
                        {body}
                    </span>
                </span>
            </label>
        </div>
    );
}

export default KTMegaOption;