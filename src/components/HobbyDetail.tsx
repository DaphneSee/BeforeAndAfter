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
        this.updateHobby = this.updateHobby.bind(this)

    }

	public render() {
        const currentHobby = this.props.currentHobby
        const { open } = this.state;
		return (
            
			<div className="container hobby-wrapper">
                <div className="row hobby-done-button">
                    <div className="btn btn-primary btn-action" onClick={this.downloadHobby.bind(this, currentHobby.url)}>Download </div>
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit </div>
                    <div className="btn btn-primary btn-action" onClick={this.deleteHobbyCheckpoint.bind(this, currentHobby.id)}>Delete </div>
                </div>
                
                <div className="row hobby-img">
                    <img src={currentHobby.url}/>
                </div>

                <div className="row hobby-heading">
                    <b>{currentHobby.title}</b>&nbsp; ({currentHobby.tags})
                </div>
                <div className="row hobby-date">
                    {currentHobby.uploaded}
                </div>
                
                
                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Hobby Title</label>
                            <input type="text" className="form-control" id="hobby-edit-title-input" placeholder="Enter Title"/>
                            <small className="form-text text-muted">You can edit any Hobby Checkpoint later</small>
                        </div>
                        <div className="form-group">
                            <label>Tag</label>
                            <input type="text" className="form-control" id="hobby-edit-tag-input" placeholder="Enter Tag"/>
                            <small className="form-text text-muted">Tag is used for search</small>
                        </div>
                        <button type="button" className="btn" onClick={this.updateHobby}>Save</button>
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
    
    // private methodNotImplemented() {
	// alert("Method not implemented")
	// }

    // Open hobby image in new tab
    private downloadHobby(url: any) {
        window.open(url);
    }
    // update a hobby checkpoint that has previously been uploaded
    private updateHobby(){
        const titleInput = document.getElementById("hobby-edit-title-input") as HTMLInputElement
        const tagInput = document.getElementById("hobby-edit-tag-input") as HTMLInputElement
    
        if (titleInput === null || tagInput === null) {
            return;
        }
    
        const currentHobby = this.props.currentHobby
        const url = "https://hobbytrackerapiw.azurewebsites.net/api/HobbyItems/" + currentHobby.id
        const updatedTitle = titleInput.value
        const updatedTag = tagInput.value
        fetch(url, {
            body: JSON.stringify({
                "height": currentHobby.height,
                "id": currentHobby.id,
                "tags": updatedTag,
                "title": updatedTitle,
                "uploaded": currentHobby.uploaded,
                "url": currentHobby.url,
                "width": currentHobby.width
            }),
            headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
            method: 'PUT'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error State
                alert(response.statusText + " " + url)
            } else {
                location.reload()
            }
        })
    }
    // delete checkpoint that has been uploaded
    private deleteHobbyCheckpoint(id: any) {
        const url = "https://hobbytrackerapiw.azurewebsites.net/api/HobbyItems/" + id
    
        fetch(url, {
            method: 'DELETE'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error Response
                alert(response.statusText)
            }
            else {
                location.reload()
            }
        })
    }
}