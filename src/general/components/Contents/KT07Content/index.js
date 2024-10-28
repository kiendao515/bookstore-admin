import React from 'react';
import PropTypes from 'prop-types';

KT07Content.propTypes = {

};

function KT07Content(props) {
    return (
        <div id='kt_content' className='content'>
            <div className='d-flex'>
                {props.children}
            </div>
        </div>
    );
}

export default KT07Content;