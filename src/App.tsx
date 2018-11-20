import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import HobbyDetail from './components/HobbyDetail';
import HobbyList from './components/HobbyList';
import PatrickLogo from './patrick-logo.png';


interface IState {
	currentHobby: any,
	hobbies: any[],
	open: boolean,
	uploadFileList: any,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentHobby: {"id":0, "title":"Loading ","url":"","tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			hobbies: [],
			open: false,
			uploadFileList: null
		}     	
		this.selectNewHobby= this.selectNewHobby.bind(this)
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			<div className="header-wrapper">
				<div className="container header">
					<img src={PatrickLogo} height='40'/>&nbsp; My Hobby Tracker - MSA 2018 &nbsp;
					<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Hobby CheckPoint</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-7">
						<HobbyDetail currentHobby={this.state.currentHobby} />
					</div>
					<div className="col-5">
						<HobbyList hobbies={this.state.hobbies} selectNewHobby={this.selectNewHobby} searchByTag={this.methodNotImplemented}/>
					</div>
				</div>
			</div>
			<Modal open={open} onClose={this.onCloseModal}>
				<form>
					<div className="form-group">
						<label>Hobby Title</label>
						<input type="text" className="form-control" id="Hobby-title-input" placeholder="Enter Title" />
						<small className="form-text text-muted">You can edit any checkpoint later</small>
					</div>
					<div className="form-group">
						<label>Tag</label>
						<input type="text" className="form-control" id="Hobby-tag-input" placeholder="Enter Tag" />
						<small className="form-text text-muted">Tag is used for search</small>
					</div>
					<div className="form-group">
						<label>Image</label>
						<input type="file" onChange={this.methodNotImplemented} className="form-control-file" id="Hobby-image-input" />
					</div>

					<button type="button" className="btn" onClick={this.methodNotImplemented}>Upload</button>
				</form>
			</Modal>
		</div>
		);
	}

	private methodNotImplemented() {
		alert("Method not implemented")
	}

	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	  };
	
	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
	};
	
	// Change selected meme
	private selectNewHobby(newHobby: any) {
		this.setState({
			currentHobby: newHobby
		})
	}
}

export default App;
