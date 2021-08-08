import React from 'react'
import Cookies from 'js-cookie'
import { countries } from '../Employer/common.js'
import { Form } from 'semantic-ui-react'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Button,Icon,Dropdown,Menu} from 'semantic-ui-react';
export class Address extends React.Component {
    constructor(props) {
        super(props)
        const details = props.addressData ?
        Object.assign({}, props.saveProfileData)
        : {
            number: "",
            street: "",
            suburb: "",
            country: "",
            city:"",
            postCode:""
        }

    this.state = {
        showEditSection: false,
        newContact: details
    }

    this.openEdit = this.openEdit.bind(this)
    this.closeEdit = this.closeEdit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.saveContact = this.saveContact.bind(this)
    this.renderEdit = this.renderEdit.bind(this)
    this.renderDisplay = this.renderDisplay.bind(this)

    }
    openEdit() {
        const details = Object.assign({}, this.props.addressData)
        this.setState({
            showEditSection: true,
            newContact: details
        })
        console.log("OpenEdit",details)
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }
    updateCountry(event)
        {
              
        }

    handleChange(event) {
        
        const data = Object.assign({}, this.state.newContact)
        
        data[event.target.name] = event.target.value
      
        this.setState({
            newContact: data
        })

        console.log("handle change",this.setState.newContact)
    }

    saveContact() {
      
        console.log("save",this.state.newContact)
        const data = Object.assign({}, this.state.newContact)
        //this.props.saveProfileData(data);
        this.props.saveProfileData(
            ({ address : { number : data.number,
                           street:data.street,
                           suburb:data.suburb,
                           country:data.country,
                           city:data.city,
                           postCode:data.postCode

                        }}));
       
        this.closeEdit()
    }
    renderEdit() {
    return(
     
        <div className='ui sixteen wide column'>
            <Form.Group>
                <ChildSingleInput  widths='equal'
                    inputType="text"
                    fluid label="Number"
                    name="number"
                    value={this.state.newContact.number}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Number"
                    errorMessage="Please Enter Number"
                />
                <ChildSingleInput
                    inputType="text"
                    fluid label="Street"
                    name="street"
                   value={this.state.newContact.street}
                   controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your Street"
                    errorMessage="Please enter Street"
                />
                <ChildSingleInput
                    inputType="text"
                    fluid label="Suburb"
                    name="suburb"
                    value={this.state.newContact.suburb}
                   controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter an Suburb"
                    errorMessage="Please enter Suburb"
                />
                    </Form.Group>
                    <Form.Group>
                   
                   
                    {this.renderCountriesDropdown()}
                   
                    {this.renderCitiesDropdown()}
                  
                   




                 <ChildSingleInput
                    inputType="text"
                    label="Post Code"
                    name="postCode"
                    value={this.state.newContact.postCode}
                    controlFunc={this.handleChange}
                    maxLength={12}
                    placeholder="Enter Post Code"
                    errorMessage="Please enter Post Code"
                />
                </Form.Group>
                <button type="button" className="ui teal button" onClick={this.saveContact}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>


    )



    } 
    
    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

   
    renderDisplay() {
       let number = this.props.addressData ? this.props.addressData.number : ""
        let street = this.props.addressData ? this.props.addressData.street : ""
        let suburb = this.props.addressData ? this.props.addressData.suburb : ""
        let postCode = this.props.addressData ? this.props.addressData.postCode : ""
       
        let city = this.props.addressData ? this.props.addressData.city : ""
        let country = this.props.addressData ? this.props.addressData.country : ""
        return(
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address:{number} {street} {suburb} {postCode}</p>
                        <p>City:{city}  </p>
                        <p>Country:{country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>

        )
       
    }

         renderCountriesDropdown() { 
                let countriesOptions = [];
      
              const selectedCountry = this.state.newContact.country;

                countriesOptions = Object.keys(Countries).map((x) =>
                <option key={x} value={x}> {x} </option>
                );

                return (
                <div className="field">
                <label>Country</label>
                <select
                className="ui dropdown"
                placeholder="Country"
                value={selectedCountry}
                onChange={this.handleChange}
                name="country">
                <option value=""> Select a country </option>
                {countriesOptions}
                </select>
                </div>
                );
                }


        renderCitiesDropdown() {
                    let citiesOptions = [];
                    const selectedCountry = this.state.newContact.country;
                    const selectedCity = this.state.newContact.city;

                    console.log(selectedCity)
                   
                    if (selectedCountry != "" && selectedCountry != null ) {
           
                        var popCities = Countries[selectedCountry].map(x => <option key={x} value={x}> {x}</option>);
            
                    }
                            
                    return (
                    <div className="field">
                    <label>City</label>
                    <select
                    className="ui dropdown"
                    placeholder="City"
                    value={selectedCity}
                    onChange={this.handleChange}
                    name="city">
                    <option value=""> Select a town or city </option>
                    {popCities}
                    </select>
                    </div>
                    );
                 
                }
                   

  }




  export class Nationality extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showEditSection: false,
            newNationality: ""
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveNationality = this.saveNationality.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit() {
        const nationality = Object.assign({}, this.props.nationality)
        this.setState({
            showEditSection: true,
            newAddress: nationality
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.nationality)
        data[event.target.name] = event.target.value
 
        this.setState({
            newNationality: data.country
        })
    }

    saveNationality() {
        const data = { nationality: this.state.newNationality };
        this.props.saveProfileData(data)
        this.closeEdit()
    }


    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <Form.Group>
                    <CountryInput
                        country={this.state.newNationality}
                        controlFunc={this.handleChange}
                        width="six" />
                </Form.Group>
                <button type="button" className="ui teal button" onClick={this.saveNationality}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {

        let nationality = this.props.nationalityData ? this.props.nationalityData: "";


        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>{nationality}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}

class CountryInput extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let widthClass = this.props.width ? `${this.props.width} wide` : "";

        let countriesOptions = [];
        const selectedCountry = this.props.country ? this.props.country : "";
        countriesOptions = Object.keys(countries).map((x) => <option key={x} value={x}>{x}</option>);

        return (
            <div className={"field " + widthClass}>
                <label>Country</label>
                <select className="ui right labeled dropdown"
                    placeholder="Country"
                    value={selectedCountry}
                    onChange={this.props.controlFunc}
                    name="country">
                    <option value="">Select a country</option>
                    {countriesOptions}
                </select>
            </div>
        )
    }
}
