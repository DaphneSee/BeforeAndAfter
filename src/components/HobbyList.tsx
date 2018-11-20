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
    }

	public render() {
		return (
			<div className="container hobby-list-wrapper">
                <div className="row hobby-list-heading">
                    <div className="input-group">
                        <input type="text" id="search-tag-textbox" className="form-control" placeholder="Search By Tags" />
                        <div className="input-group-append">
                            <div className="btn btn-outline-secondary search-button" onClick = {this.searchByTag}>Search</div>
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

}