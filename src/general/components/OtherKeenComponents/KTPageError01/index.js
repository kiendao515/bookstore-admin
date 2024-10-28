import React from 'react';
import PropTypes from 'prop-types';
import AppResource from 'general/constants/AppResource';
import useRouter from 'hooks/useRouter';

KTPageError01.propTypes = {

};

function KTPageError01(props) {
    // MARK: --- Params ---
    const router = useRouter();

    // MARK: --- Functions ---
    function handleBack() {
        router.navigate(-1);
    }

    return (
        <div className='d-flex flex-column flex-root min-vh-100 bg-white'>
            <div className='d-flex flex-center flex-column-fluid'>
                <div className='d-flex flex-center flex-column flex-lg-row p-10 p-lg-20'>
                    <div className='d-flex flex-column justify-content-center align-items-center align-items-lg-end flex-row-fluid order-2 order-lg-1'>
                        <h1 className='font-weight-boldest text-danger mb-5' style={{ fontSize: '8rem' }}>
                            404
                        </h1>
                        <p className='font-size-h3 text-center text-muted font-weight-normal py-2'>
                            OOPS! Something went wrong here
                        </p>
                        <a href='#' className='btn btn-light-primary font-weight-bolder py-4 px-8' onClick={handleBack}>
                            <span className='svg-icon svg-icon-md mr-3'>
                                <i className="far fa-arrow-left" />
                            </span>
                            Return Home
                        </a>
                    </div>

                    <img
                        alt='image'
                        className='w-100 w-sm-350px w-md-600px order-1 order-lg-2'
                        src={AppResource.images.keens.bg1}
                    />
                </div>
            </div>
        </div>
    );
}

export default KTPageError01;