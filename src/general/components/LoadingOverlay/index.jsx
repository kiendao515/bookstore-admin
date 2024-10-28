import React from 'react';
import PropTypes from 'prop-types';

LoadingOverlay.propTypes = {
    message: PropTypes.string,
    additionalClassName: PropTypes.string,
};

LoadingOverlay.defaultProps = {
    message: '',
    additionalClassName: '',
};

function LoadingOverlay(props) {
    const { message, additionalClassName } = props;

    return (
        <div className={`overlay-layer bg-dark-o-40 ${additionalClassName}`}>
            <div className="spinner spinner-right spinner-primary pr-12 py-3 pl-4 rounded">
                <span className="text-secondary">{message}</span>
            </div>
        </div>
    );
}

export default LoadingOverlay;