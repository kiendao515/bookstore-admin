import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { string } from 'yup';

export const KTTooltipPositions = {
    autoStart: 'auto-start',
    auto: 'auto',
    autoEnd: 'auto-end',
    topStart: 'top-start',
    top: 'top',
    topEnd: 'top-end',
    rightStart: 'right-start',
    right: 'right',
    rightEnd: 'right-end',
    bottomEnd: 'bottom-end',
    bottom: 'bottom',
    bottomStart: 'bottom-start',
    leftEnd: 'left-end',
    left: 'left',
    leftStart: 'left-start'
};

KTTooltip.propTypes = {
    position: PropTypes.oneOf(Object.values(KTTooltipPositions)),
    text: PropTypes.string,
};

KTTooltip.defaultProps = {
    position: KTTooltipPositions.top,
    text: '',
};

/**
 * 
 * @param {{position: string, text: string}} props 
 * @returns 
 */
function KTTooltip(props) {
    // MARK: --- Params ---
    const { position, text } = props;

    return (
        <div>
            {
                text.length > 0 ? (
                    <OverlayTrigger
                        placement={position}
                        overlay={(
                            <Tooltip>{text}</Tooltip>
                        )}
                    >
                        {props.children}
                    </OverlayTrigger>
                ) : (
                    <>{props.children}</>
                )
            }
        </div>
    );
}

export default KTTooltip;