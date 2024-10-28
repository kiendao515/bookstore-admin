import AppResource from 'general/constants/AppResource';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

NotFound.propTypes = {

};

function NotFound(props) {
    // MARK: --- Params ---
    const history = useHistory();
    const { t } = useTranslation();

    // MARK: --- Functions ---
    const handleClickBack = () => {
        history.goBack();
    };

    return (
        <div className="d-flex flex-column flex-root bg-white" style={{ height: "100vh" }}>
            {/* begin::Error */}
            <div className="d-flex flex-column-fluid flex-center">
                <div className="d-flex flex-center flex-column flex-lg-row p-10 p-lg-20">
                    <div className="d-flex flex-column justify-content-end align-items-center align-items-lg-end flex-row-fluid order-2 order-lg-1">
                        {/* begin::Content */}
                        <h1 className="font-weight-boldest text-danger mb-5" style={{ fontSize: "8rem" }}>404</h1>
                        <p className="font-size-h3 text-center text-muted font-weight-normal py-2">{t('PageNotFound')}</p>
                        <a href="#" onClick={handleClickBack} className="btn btn-light-primary font-weight-bolder py-4 px-8">
                            <i className="fad fa-arrow-left mr-2"></i>{t('Back')}</a>
                        {/* end::Content */}
                    </div>
                    <img src={AppResource.images.img404} alt="image" className="w-100 w-sm-350px w-md-600px order-1 order-lg-2" />
                </div>
            </div>
            {/* end::Error */}
        </div>
    );
}

export default NotFound;