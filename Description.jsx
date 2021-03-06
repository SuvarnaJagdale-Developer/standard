import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export class Description extends React.Component {

    constructor(props) {
        super(props);

        const newDescription = props.description ? props.description : "";
        const newSummary = props.summary ? props.summary : "";

        this.state = {
            showEditSection: false,
            newDescription,
            newSummary
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveSelfIntroduction = this.saveSelfIntroduction.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }


    openEdit() {
        this.setState({
            showEditSection: true,
            newDescription: this.props.descriptionData,
            newSummary: this.props.summary
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        let { name, value } = event.target;

        this.setState({
            [name]:value
        })
    }

    saveSelfIntroduction() {
        const data = Object.assign({}, { description: this.state.newDescription, summary: this.state.newSummary })
        this.props.saveProfileData(data)
        this.closeEdit()
    }


    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderDisplay() {
        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Summary : {this.props.summary}</p>
                        <p>Description: {this.props.descriptionData}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div >
        )
    }

    renderEdit() {

        console.log("Decrsiptio",this.state.newDescription)
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="Summary"
                    name="newSummary"
                    value={this.state.newSummary}
                    controlFunc={this.handleChange}
                    maxLength={150}
                    placeholder="Please provide a short summary of yourself"
                    errorMessage="Invalid"
                />
                <ChildSingleInput
                    inputType="text"
                    label="Description"
                    name="newDescription"
                    value={this.state.newDescription}
                    controlFunc={this.handleChange}
                    minLength={150}
                    maxLength={500}
                    placeholder="Please tell us about your hobbies, quirks or anything else"
                    errorMessage="Invalid"
                />

                <button type="button" className="ui teal button" onClick={this.saveSelfIntroduction}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>

        );
    }
}
