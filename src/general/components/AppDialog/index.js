/**
 * 
 * Usage: 
 *  AppDialogHelper.show('Title', 'Description', [
        {
            title: 'Yes', type: 'positive', onClick: () => {
                AppDialogHelper.hide();
            }
        },
        {
            title: 'Cancel', type: 'neutral', onClick: () => {
                AppDialogHelper.hide();
            }
        },
        {
            title: 'No', type: 'negative', onClick: () => {
                AppDialogHelper.hide();
            }
        }
    ]);
 * 
 */

import { createRef, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

AppDialog.propTypes = {

};

const ref = createRef();
const sTag = '[AppDialog]';

// MARK: --- Helper functions ---
function getButtonVariant(type) {
    let buttonVariant = 'primary';
    if (type === 'negative') {
        buttonVariant = 'danger';
    }
    if (type === 'neutral') {
        buttonVariant = 'secondary';
    }
    return buttonVariant;
}

function AppDialog(props) {
    // MARK: --- Params ---
    const [dialogShowing, setDialogShowing] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [buttons, setButtons] = useState([]);

    // MARK: --- Functions ---
    function handleClose() {
        setDialogShowing(false);
    }

    // MARK: --- Hooks ---
    useEffect(() => {
        console.log(`${sTag} did load`);
        ref.current = {
            show: (title, description, buttons) => {
                setDialogShowing(true);
                setTitle(title);
                setDescription(description);
                setButtons(buttons);
            },
            hide: () => {
                setDialogShowing(false);
            }
        };

        return () => {
            console.log(`${sTag} will dismiss`);
        }
    }, []);

    return (
        <div>
            <Modal
                className='AppDialog'
                show={dialogShowing}
                onHide={handleClose}
                centered
                onExit={() => {

                }}
            >
                {/* Header */}
                <Modal.Header className='px-5 py-5'>
                    <Modal.Title>
                        {title}
                    </Modal.Title>
                    <div
                        className="btn btn-xs btn-icon btn-light btn-hover-secondary cursor-pointer"
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        <i className="far fa-times"></i>
                    </div>
                </Modal.Header>

                {/* Body */}
                <Modal.Body>
                    {description}
                </Modal.Body>

                {
                    buttons && buttons.length > 0 && (
                        <Modal.Footer>
                            <div className='row flex-grow-1'>
                                {
                                    buttons.map((item, index) => {
                                        return (
                                            <div className={`col ${index === 0 && 'pl-0'} ${index === buttons.length - 1 && 'pr-0'}`} key={index}>
                                                <Button
                                                    className='font-weight-bold flex-grow-1 col'
                                                    variant={getButtonVariant(item?.type)}
                                                    onClick={() => {
                                                        if (item?.onClick) {
                                                            item?.onClick();
                                                        }
                                                    }}>
                                                    {item?.title}
                                                </Button>
                                            </div>
                                        );
                                    })
                                }
                            </div>

                        </Modal.Footer>
                    )
                }
            </Modal>
        </div>
    );
}

export default AppDialog;
export const AppDialogHelper = {
    /**
     * Show dialog
     * @param {string} title Dialog title
     * @param {string} description Dialog description
     * @param {[object]} buttons Dialog buttons
     */
    show: (title, description, buttons = []) => {
        ref.current.show(title, description, buttons);
    },
    /**
     * Hide dialog
     */
    hide: () => {
        ref.current.hide();
    }
};