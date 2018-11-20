import * as React from "react";
import Modal from 'react-responsive-modal';

interface IProps {
    currentHobby: any
}

interface IState {
    open: boolean
}

export default class HobbyDetail extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false
        }

    }

	public render() {
        const currentHobby = this.props.currentHobby
        const { open } = this.state;
		return (
			<div className="container Hobby-wrapper">
                <div className="row Hobby-heading">
                    <b>{currentHobby.title}</b>&nbsp; ({currentHobby.tags})
                </div>
                <div className="row Hobby-date">
                    {currentHobby.uploaded}
                </div>
                <div className="row Hobby-img">
                    <img src={currentHobby.url}/>
                </div>
                
                <div className="row Hobby-done-button">
                    <div className="btn btn-primary btn-action" onClick={this.downloadHobby.bind(this, currentHobby.url)}>Download </div>
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit </div>
                    <div className="btn btn-primary btn-action" onClick={this.methodNotImplemented.bind(this, currentHobby.id)}>Delete </div>
                </div>
                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Hobby Title</label>
                            <input type="text" className="form-control" id="Hobby-edit-title-input" placeholder="Enter Title"/>
                            <small className="form-text text-muted">You can edit any Hobby Checkpoint later</small>
                        </div>
                        <div className="form-group">
                            <label>Tag</label>
                            <input type="text" className="form-control" id="Hobby-edit-tag-input" placeholder="Enter Tag"/>
                            <small className="form-text text-muted">Tag is used for search</small>
                        </div>
                        <button type="button" className="btn" onClick={this.methodNotImplemented}>Save</button>
                    </form>
                </Modal>
            </div>
		);
    }

    // Modal Open
    private onOpenModal = () => {
        this.setState({ open: true });
	  };
    
    // Modal Close
    private onCloseModal = () => {
		this.setState({ open: false });
    };
    
    private methodNotImplemented() {
		alert("Method not implemented")
	}

    // Open meme image in new tab
    private downloadHobby(url: any) {
        window.open(url);
    }
}