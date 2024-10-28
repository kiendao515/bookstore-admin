import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AppResource from 'general/constants/AppResource';
import { useTranslation } from 'react-i18next';

AppSearch.propTypes = {

};

AppSearch.defaultProps = {

};

function AppSearch(props) {
    // MARK: --- Params ---
    const { } = props;
    const { t } = useTranslation();
    const [text, setText] = useState('');
    const typingTimeoutRef = useRef(null);

    // MARK: --- Functions ---
    function handleChangeText(e) {
        const newText = e?.target?.value ?? '';
        setText(newText);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            console.log({ newText });
        }, 300);
    }

    return (
        <div className=''>
            <div className='quick-search quick-search-dropdown'>
                <form className='quick-search-form'>
                    <div className='input-group'>
                        <div className='input-group-prepend'>
                            <span className='input-group-text'>
                                <span className='svg-icon svg-icon-lg'>
                                    <img
                                        alt='icon'
                                        src={AppResource.icons.keens.search}
                                        style={{
                                            filter: 'invert(87%) sepia(3%) saturate(2052%) hue-rotate(195deg) brightness(85%) contrast(80%)'
                                        }}
                                    />
                                </span>
                            </span>
                        </div>
                        <input
                            type='text'
                            className='form-control'
                            placeholder={`${t('Search')}...`}
                            value={text}
                            onChange={handleChangeText}
                        />
                        {
                            text.length > 0 && (
                                <div className='input-group-append'>
                                    <span className='input-group-text'>
                                        <i className='quick-search-close ki ki-close icon-sm text-muted d-flex' onClick={() => handleChangeText(null)} />
                                    </span>
                                </div>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AppSearch;