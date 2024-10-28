import React from 'react';
import PropTypes from 'prop-types';

KTBSCard.propTypes = {
    title: PropTypes.string,
    body: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
};

KTBSCard.defaultProps = {
    title: '',
    body: '',
};

/**
 * 
 * @param {{title: string, body: string|element}} props 
 * @returns 
 */
function KTBSCard(props) {
    // MARK: --- Params ---
    const { title, body } = props;

    return (
        <div className='card card-custom'>
            {/* header */}
            <div className='card-header'>
                {/* title */}
                <div className='card-title'>
                    <h3 className='card-label'>{title}</h3>
                </div>
            </div>

            {/* body */}
            <div className='card-body'>
                {body}
            </div>
        </div>
    );
}

export default KTBSCard;