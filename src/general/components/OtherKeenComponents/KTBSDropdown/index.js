import _ from 'lodash';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export const KTBSDropdownDirections = {
    left: 'dropleft',
    up: 'dropup',
    right: 'dropright',
    down: 'dropdown'
};

export const KTBSDropdownAlignments = {
    start: 'dropdown-menu-start',
    end: 'dropdown-menu-end',
};

export const KTBSDropdowAutoCloseBehavior = {
    true: 'true',
    false: 'false',
    inside: 'inside',
    outside: 'outside'
}

KTBSDropdown.propTypes = {
    toggleWrapperClassName: PropTypes.string,
    toggleElement: PropTypes.element,
    dropdownMenuClassName: PropTypes.string,
    dropdownMenuItems: PropTypes.array,
    selectedValue: PropTypes.string,
    direction: PropTypes.oneOf(Object.values(KTBSDropdownDirections)),
    alignment: PropTypes.oneOf(Object.values(KTBSDropdownAlignments)),
    offset: PropTypes.object,
    staticDisplay: PropTypes.bool, // on | off dynamic positioning
    autoCloseBehavior: PropTypes.oneOf(Object.values(KTBSDropdowAutoCloseBehavior)),
    contentEl: PropTypes.element,

    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
};

KTBSDropdown.defaultProps = {
    toggleWrapperClassName: '',
    toggleElement: <></>,
    dropdownMenuClassName: '',
    dropdownMenuItems: [],
    selectedValue: null,
    direction: KTBSDropdownDirections.down,
    alignment: KTBSDropdownAlignments.start,
    offset: null,
    staticDisplay: true,
    autoCloseBehavior: KTBSDropdowAutoCloseBehavior.true,
    contentEl: null,

    onChange: null,
    onBlur: null,
    onFocus: null,
};

/**
 * 
 * @param {{
 * toggleWrapperClassName: string, 
 * toggleElement: element, 
 * dropdownMenuClassName: string, 
 * dropdownMenuItems: object[], 
 * selectedValue: string, 
 * direction: string, 
 * alignment: string,
 * offset: {},
 * staticDisplay: boolean,
 * autoCloseBehavior: boolean,
 * contentEl: element,
 * onChange: function,
 * onBlur: function,
 * onFocus: function,
 * }} props 
 * @returns 
 */
function KTBSDropdown(props) {
    // MARK: --- Params ---
    const {
        toggleWrapperClassName,
        toggleElement,
        dropdownMenuClassName,
        dropdownMenuItems,
        selectedValue,
        direction,
        alignment,
        offset,
        staticDisplay,
        autoCloseBehavior,
        contentEl,

        onChange,
        onBlur,
        onFocus,
    } = props;
    const { t } = useTranslation();

    // MARK: --- Functions ---
    function handleChange(targetValue) {
        if (onChange) {
            onChange(targetValue);
        }
    }

    function handleBlur() {
        if (onBlur) {
            onBlur();
        }
    }

    function handleFocus() {
        if (onFocus) {
            onFocus();
        }
    }

    return (
        <div className={`${direction}`}>
            {/* Toggle element */}
            {
                staticDisplay ? (
                    <div
                        className={`${toggleWrapperClassName} ${direction}`}
                        data-bs-toggle='dropdown'
                        data-bs-display='static'
                        aria-expanded='false'
                        data-bs-auto-close={autoCloseBehavior}
                    >
                        {toggleElement}
                    </div>
                ) : (
                    <div
                        className={`${toggleWrapperClassName} ${direction}`}
                        data-bs-toggle='dropdown'
                        aria-expanded='false'
                        data-bs-auto-close={autoCloseBehavior}
                    >
                        {toggleElement}
                    </div>
                )
            }

            {/* Dropdown menu */}
            <div className={`dropdown-menu ${dropdownMenuClassName} ${alignment}`}>
                {
                    !_.isEmpty(contentEl) ? (
                        <div>{contentEl}</div>
                    ) : (
                        <div>
                            {
                                dropdownMenuItems.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <>
                                                <a
                                                    className={`dropdown-item ${!_.isEmpty(selectedValue) && selectedValue === item.value && 'active'}`}
                                                    href='#'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleChange(item.value);
                                                    }}
                                                >
                                                    {
                                                        item.icon && (
                                                            <img
                                                                alt='icon'
                                                                src={item.icon}
                                                                className='w-25px h-25px rounded mr-2'
                                                            />
                                                        )
                                                    }
                                                    {t(item.name)}
                                                </a>
                                                {
                                                    item.showDivider && (
                                                        <div className='dropdown-divider'></div>
                                                    )
                                                }
                                            </>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
        </div >
    );
}

export default KTBSDropdown;