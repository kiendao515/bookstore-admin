import React, { createRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

AppOffcanvas.propTypes = {
    id: PropTypes.string.isRequired,
    position: PropTypes.oneOf(['left', 'right']),
    toggleByElementId: PropTypes.string.isRequired,
    closeByElementId: PropTypes.string,
};

AppOffcanvas.defaultProps = {
    position: 'left',
    closeByElementId: '',
};

const sTag = '[AppOffcanvas]';

function AppOffcanvas(props) {
    // MARK: --- Params ---
    const { id, position, toggleByElementId, closeByElementId } = props;
    const refOffcanvas = useRef(null);

    // MARK: --- Hooks ---
    useEffect(() => {
        console.log(`${sTag} did load`);

        if (typeof KTOffcanvas !== undefined && refOffcanvas.current === null) {
            const offcanvas = new KTOffcanvas(id, {
                baseClass: 'offcanvas',
                overlay: true,
                closeBy: closeByElementId,
                toggleBy: {
                    target: toggleByElementId
                }
            });
            refOffcanvas.current = offcanvas;
        }

        return () => {
            console.log(`${sTag} will dismiss`);
        }
    }, []);

    return (
        <div
            id={id}
            className={`offcanvas offcanvas-${position} bg-white d-flex flex-column h-100 visible`}
        >
            <p>Offcanvas</p>
            <button onClick={() => {
                refOffcanvas.current.hide();
            }}>Click Me</button>
        </div>
    );
}

export default AppOffcanvas;