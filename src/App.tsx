import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import HobbyDetail from './components/HobbyDetail';
import HobbyList from './components/HobbyList';
import * as Webcam from "react-webcam";
import WebsiteLogo from './beforeNAfter.png';


interface IState {
	currentHobby: any,
	hobbies: any[],
	open: boolean,
	uploadFileList: any,
	authenticated: boolean,
	refCamera: any,
	predictionResult: any
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentHobby: {"id":0, "title":"Loading ","url":"","tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			hobbies: [],
			open: false,
			uploadFileList: null,
			authenticated: false,
			refCamera: React.createRef(),
			predictionResult: null
		}     	
		this.selectNewHobby= this.selectNewHobby.bind(this)
		this.fetchHobbies = this.fetchHobbies.bind(this)
		this.fetchHobbies("")
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.uploadImage = this.uploadImage.bind(this)
		this.authenticate = this.authenticate.bind(this)
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			{(!this.state.authenticated) ?
			<Modal open={!this.state.authenticated} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
				<Webcam
				audio={false}
				screenshotFormat="image/jpeg"
				ref={this.state.refCamera}
			/>
				<div className="row nav-row">
				<div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
				</div>
				</Modal> : ""}
				{(this.state.authenticated) ?
			<div>
				<div className="header-wrapper">
					<div className="container header">
						<img src={WebsiteLogo} height='40'/>
						<a id="title">Before And After - A Hobby Tracker - MSA 2018</a>
						<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}> + Add new</div>
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-md-7">
							<HobbyDetail currentHobby={this.state.currentHobby} />
						</div>
						<div className="col-md-5">
							<HobbyList hobbies={this.state.hobbies} selectNewHobby={this.selectNewHobby} searchByTag={this.fetchHobbies}/>
						</div>
					</div>
				</div>
				<Modal open={open} onClose={this.onCloseModal}>
					<form>
						<div className="form-group">
							<label>Hobby Title</label>
							<input type="text" className="form-control" id="hobby-title-input" placeholder="Enter Title" />
							<small className="form-text text-muted">You can edit any checkpoint later</small>
						</div>
						<div className="form-group">
							<label>Tag</label>
							<input type="text" className="form-control" id="hobby-tag-input" placeholder="Enter Tag" />
							<small className="form-text text-muted">Tag is used for search</small>
						</div>
						<div className="form-group">
							<label>Image</label>
							<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="hobby-image-input" />
						</div>

						<button type="button" className="btn" onClick={this.uploadImage}>Upload</button>
					</form>
				</Modal>
			</div>
				:""}
			</div>

		);
	}

	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	  };
	
	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
	};
	
	// Change selected hobby
	private selectNewHobby(newHobby: any) {
		this.setState({
			currentHobby: newHobby
		})
	}
	// obtain previously uploaded image of hobby CP
	private fetchHobbies(tag: any) {
		let url = "https://hobbytrackerapiw.azurewebsites.net/api/HobbyItems"
		if (tag !== "") {
			url += "/tag?=" + tag
		}
		fetch(url, {
			method: 'GET'
		})
		.then(res => res.json())
		.then(json => {
			let currentHobby = json[0]
			if (currentHobby === undefined) {
				currentHobby = {"id":0, "title":"no hobbies","url":"","tags":"try a different tag","uploaded":"","width":"0","height":"0"}
			}
			this.setState({
				currentHobby,
				hobbies: json
			})
		});
	}
	private handleFileUpload(fileList: any) {
		this.setState({
			uploadFileList: fileList.target.files
		})
	}
	private uploadImage() {
		const titleInput = document.getElementById("hobby-title-input") as HTMLInputElement
		const tagInput = document.getElementById("hobby-tag-input") as HTMLInputElement
		const imageFile = this.state.uploadFileList[0]
	
		if (titleInput === null || tagInput === null || imageFile === null) {
			return;
		}
	
		const title = titleInput.value
		const tag = tagInput.value
		const url = "https://hobbytrackerapiw.azurewebsites.net/api/HobbyItems/upload"
	
		const formData = new FormData()
		formData.append("Title", title)
		formData.append("Tags", tag)
		formData.append("image", imageFile)
	
		fetch(url, {
			body: formData,
			headers: {'cache-control': 'no-cache'},
			method: 'POST'
		})
		.then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				location.reload()
			}
		})
	}

	// Authenticate
	private authenticate() { 
	// const screenshot = this.state.refCamera.current.getScreenshot();
		const screenshot = this.state.refCamera.current.getScreenshot();
		this.getFaceRecognitionResult(screenshot);
	}

	// Call custom vision model
private getFaceRecognitionResult(image: string) {
	const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/9638ebef-3a58-4ecc-ae0d-05adabacac98/image?iterationId=4f838388-af51-46ca-8f36-0e29e127ac96"
	if (image === null) {
		return;
	}
	const base64 = require('base64-js');
	const base64content = image.split(";")[1].split(",")[1]
	const byteArray = base64.toByteArray(base64content);
	fetch(url, {
		body: byteArray,
		headers: {
			'cache-control': 'no-cache', 'Prediction-Key': 'cd81c739b3af4637b617921c4bd82cf9', 'Content-Type': 'application/octet-stream'
		},
		method: 'POST'
	})	
	.then((response: any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				response.json().then((json: any) => {
					console.log(json.predictions[0])
					this.setState({predictionResult: json.predictions[0] })
					if (this.state.predictionResult.probability > 0.7) {
						this.setState({authenticated: true})
					} else {
						this.setState({authenticated: false})
						console.log(json.predictions[0].tagName)
						
					}
				})
			}
		})
	}
}

export default App;
