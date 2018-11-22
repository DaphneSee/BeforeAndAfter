import MediaStreamRecorder from 'msr';
import * as React from "react";


interface IProps {
    hobbies: any[],
    selectNewHobby: any,
    searchByTag: any
}

export default class HobbyList extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)   
        this.searchByTag = this.searchByTag.bind(this)
        this.searchTagByVoice = this.searchTagByVoice.bind(this)
        this.postAudio = this.postAudio.bind(this)
    }

	public render() {
		return (
			<div className="container hobby-list-wrapper">
                <div className="row hobby-list-heading">
                    <div className="input-group">
                        <input type="text" id="search-tag-textbox" className="form-control" placeholder="Search By Tags" />
                        <div className="input-group-append">
                            <div className="btn btn-outline-secondary search-button" onClick = {this.searchByTag}>Search</div>
                            <div className="btn" onClick={this.searchTagByVoice}><i className="fa fa-microphone" /></div>
                        </div>
                    </div>  
                </div>
                <div className="row hobby-list-table">
                    <table className="table table-striped">
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                </div>
            </div>
		);
    }

    // Construct table using meme list
	private createTable() {
        const table:any[] = []
        const hobbyList = this.props.hobbies
        if (hobbyList == null) {
            return table
        }

        for (let i = 0; i < hobbyList.length; i++) {
            const children = []
            const hob = hobbyList[i]
            children.push(<td key={"id" + i}>{hob.id}</td>)
            children.push(<td key={"name" + i}>{hob.title}</td>)
            children.push(<td key={"tags" + i}>{hob.tags}</td>)
            table.push(<tr key={i+""} id={i+""} onClick= {this.selectRow.bind(this, i)}>{children}</tr>)
        }
        return table
    }
    
    // Hobby selection handler to display selected hobby in details component
    private selectRow(index: any) {
        const selectedHobby = this.props.hobbies[index]
        if (selectedHobby != null) {
            this.props.selectNewHobby(selectedHobby)
        }
    }

    // Search Hobby by tag
    private searchByTag() {
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
        if (textBox === null) {
            return;
        }
        const tag = textBox.value 
        this.props.searchByTag(tag)  
    }

    // search tag by voice
    private searchTagByVoice(){
        const mediaConstraints = {
            audio: true
        };
        const onMediaSuccess = (stream: any) => {
            const mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
            mediaRecorder.ondataavailable = (blob: any) => {
                this.postAudio(blob);
                mediaRecorder.stop()
            }
            mediaRecorder.start(3000);
        }
    
        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)
    
        function onMediaError(e: any) {
            console.error('media error', e);
        }
    }

    private postAudio(blob: any){
        let accessToken: any;
        fetch('https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken', {
        headers: {
            'Content-Length': '0',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': 'f599dba25a3d443c82ff196f6587984e'
        },
        method: 'POST'
        }).then((response) => {
        // console.log(response.text())
        return response.text()
        }).then((response) => {
        console.log(response)
        accessToken = response
        }).catch((error) => {
        console.log("Error", error)
        });
        
         // posting audio
        fetch('https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US.', {
        body: blob, // this is a .wav audio file    
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer' + accessToken,
            'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
            'Ocp-Apim-Subscription-Key': 'f599dba25a3d443c82ff196f6587984e'},
        method: 'POST'
        }).then((res) => {
        return res.json()
        }).then((res: any) => {
            const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
            textBox.value = (res.DisplayText as string).slice(0, -1)
        console.log(res)
        }).catch((error) => {
        console.log("Error", error)
        });



    }

}