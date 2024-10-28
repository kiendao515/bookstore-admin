/**
 * 
 * Usage: 
 *  <KTStickyToolbar
        items={[
            { icon: 'fad fa-desktop text-success', hoverClassName: 'btn-hover-success', onClick: () => alert('0') },
            { icon: 'fad fa-cog text-primary', hoverClassName: 'btn-hover-primary', onClick: () => alert('1') },
            { icon: 'fad fa-book text-warning', hoverClassName: 'btn-hover-warning', onClick: () => alert('2') },
            { icon: 'fad fa-comment-alt-dots text-info', hoverClassName: 'btn-hover-info', onClick: () => alert('3') }
        ]}
    />
 * 
 */

import PropTypes from 'prop-types';
import KTTooltip, { KTTooltipPositions } from '../KTTooltip';

KTStickyToolbar.propTypes = {
    items: PropTypes.array,
};

KTStickyToolbar.defaultProps = {
    items: [],
};

function KTStickyToolbar(props) {
    // MARK: --- Params ---
    const { items } = props;

    return (
        <div>
            <ul className='sticky-toolbar nav flex-column pl-2 pr-2 pt-3'>
                {
                    items.map((item, index) => {
                        return (
                            <li key={index} className='nav-item mb-2'>
                                <KTTooltip position={KTTooltipPositions.left} text={item?.tooltipText}>
                                    <a
                                        className={`btn btn-sm btn-icon btn-bg-light ${item?.hoverClassName ?? 'btn-hover-primary'}`}
                                        href='#'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.target.blur();
                                            if (item?.onClick) {
                                                item?.onClick();
                                            }
                                        }}
                                    >
                                        <i className={item?.icon} />
                                    </a>
                                </KTTooltip>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
}

export default KTStickyToolbar;