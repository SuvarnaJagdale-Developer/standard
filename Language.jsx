/* Language section */

import React ,{ Fragment }from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Table, Button, Icon, Grid,Segment,Menu,Dropdown} from 'semantic-ui-react';

export default class Language extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          editLanguageId:"",
        addLanguage:{
          id: "",
          Language:"",
          LanguageLevel:"",
         
         },
            showEditSection: false,
            addeOrUpdate: "",
        }
        this.openNew = this.openNew.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.saveData=this.saveData.bind(this)
        this.updateStateData = this.updateStateData.bind(this)
        this.handleChange=this.handleChange.bind(this)
        this.openEdit = this.openEdit.bind(this)
    }

    openEdit(languages) {
     

      this.setState({
          showEditSection: true,
          editLanguageId:languages.id,
          addLanguage: {
            id: languages.id,
            Language: languages.name,
            LanguageLevel: languages.level
        },  
        addeOrUpdate:"Update"
      })
  }
   openNew() {
       
        console.log("new Open"),
        this.setState({
            showEditSection: true,
            addLanguage: {
              id: "",
              Language: "",
              LanguageLevel: ""
          }, 
          addeOrUpdate:"Create"
        })
       
        
    }
       
  closeEdit() {
      console.log("close")
            this.setState({
                showEditSection: false,
                editLanguageId:""
            })
        }
    updateStateData(event) {
           const data = Object.assign({}, this.state.addLanguage)
           
            data[event.target.name] = event.target.value
            
            this.setState({
              addLanguage:data
              
            })
            console.log("set",data);
        }
     handleChange(event,data) 
     {
           
       const{addLanguage}=this.state
       addLanguage.LanguageLevel = data.value
       this.setState({
        addLanguage 
    })

  }

  deleteLanguage(languageId) {
    
    var cookies = Cookies.get('talentAuthToken');
    $.ajax({
        url: 'http://localhost:60290/profile/profile/DeleteLanguage',
        headers: {
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(languageId),
        success: function (res) {
            console.log(res)
            if (res.success == true) 
            { 
              if (this.state.addeOrUpdate === "Create")
                    {
                        TalentUtil.notification.show("Deleted  sucessfully", "success", null, null)
                    }                    
                    else
                    {
                        TalentUtil.notification.show("Language updated sucessfully", "success", null, null)
                    }                    
                    this.props.loadData()
                } else {
                    TalentUtil.notification.show("Language did not add successfully", "error", null, null)
                }
        }.bind(this),
        error: function (res, a, b) {
            console.log(res)
            console.log(a)
            console.log(b)
        }
    })
}

  saveData()
    {
        console.log("saveData",this.state.addLanguage)
    
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
          url: 'http://localhost:60290/profile/profile/addLanguage',
          headers: {
              'Authorization': 'Bearer ' + cookies,
              'Content-Type': 'application/json'
          },
          type: "POST",
          data: JSON.stringify(this.state.addLanguage),
          success: function (res) {

          console.log("Load Data",res)
          if (res.success == true) {
            console.log("getData",res.data)
            TalentUtil.notification.show("Add Language sucessfully", "success", null, null)
            this.props.loadData()

        } 
        else {
            TalentUtil.notification.show("Langauage not update successfully", "error", null, null)
        }
         }.bind(this),
          error: function (res, a, b) {
            console.log(res)
            console.log(a)
            console.log(b)
        }  
        }); 
       this.setState({showEditSection: false}) 
       this.setState({ editLanguageId:" "})   
        }

   

    render() {
        return (
            this.state.showEditSection ? this.renderNew() : this.renderDisplay()
        )
    }

    renderNew() {

        const options = [
            { key: 1, text: 'Basic', value:'Basic'},
            { key: 2, text: 'Conversational', value:'Conversational'},
            { key: 3, text: 'Fluent', value:'Fluent'},
            { key: 4, text: 'Native/Bilingual', value:'Native/Bilingual'},
          ]
             
         return(
             <div class='row'>
               <div className='ui sixteen wide column'>
                    <Grid columns='equal'>
                   
                      <Grid.Column>
                      <ChildSingleInput
                        inputType="text"
                        name="Language"
                        value={this.state.addLanguage.Language}
                        controlFunc={this.updateStateData}
                        maxLength={80}
                        placeholder="Add Language"
                        errorMessage="Please enter a valid name"/>
                        </Grid.Column>

                        <Grid.Column> 
                        <Dropdown
                                placeholder='Select Level'
                                fluid
                                selection
                                options={options}
                                value={this.state.addLanguage.LanguageLevel} 
                                onChange={(event,{ value  })=>this.handleChange (event,{ value })}  
                                
                            />

                        </Grid.Column>
                        <Grid.Column> 
                        <button type="button" className="ui teal button" onClick={this.saveData}>Add</button>
                        <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
                        </Grid.Column>
                        </Grid>
                      {this.renderDisplay()}
                      </div>
                      </div>
                      )
            }
            
            
            renderDisplay()
            {
              const options = [
                { key: 1, text: 'Basic', value:'Basic'},
                { key: 2, text: 'Conversational', value:'Conversational'},
                { key: 3, text: 'Fluent', value:'Fluent'},
                { key: 4, text: 'Native/Bilingual', value:'Native/Bilingual'},
              ]
             return (
 
                <div className='ui sixteen wide column'>
                 <form>
            <Table> 
            <Table.Header> 
            <Table.Row>
           
            <Table.HeaderCell>Language</Table.HeaderCell>
            <Table.HeaderCell>Level</Table.HeaderCell>
            <Table.HeaderCell>
             <button type="button" className="ui teal button" onClick={this.openNew}>
             <Icon name='plus'/>
              Add</button>
              </Table.HeaderCell>
               </Table.Row> 
                </Table.Header>
                
                <Table.Body>
                   {this.props.languageData.map((languages) => (

                 <Fragment>
                           {this.state.editLanguageId===languages.id ?(

                        <Table.Row>
                                <Table.Cell>
                                <ChildSingleInput
                        inputType="text"
                        name="Language"
                        value={this.state.addLanguage.Language}
                        controlFunc={this.updateStateData}
                        maxLength={80}
                        placeholder="Add Language"
                        errorMessage="Please enter a valid name"/>
                                
                                 
                                 </Table.Cell>         
                                 <Table.Cell>
                                 <Dropdown
                                placeholder='Select Level'
                                fluid
                                selection
                                options={options}
                                value={this.state.addLanguage.LanguageLevel} 
                                onChange={(event,{ value  })=>this.handleChange (event,{ value })}  
                                />
                                  </Table.Cell> 
                                 
                             <Table.Cell>

                             <button type="button" class="ui blue basic button" onClick={this.saveData}>Update</button>
                           <button type="button"class="ui red basic button" onClick={this.closeEdit}>Cancel</button>
                       
                           </Table.Cell>
                           </Table.Row>
                          
                             
                           ) :(
  
                      <Table.Row key={languages.id}>
                      <Table.Cell>{languages.name}</Table.Cell>
                      <Table.Cell>{languages.level}</Table.Cell>
                      <Table.Cell> <Icon name='pencil alternate' onClick={()=>this.openEdit(languages)}/>
                      <i className="delete icon" onClick={()=>this.deleteLanguage(languages.id)}></i></Table.Cell>
                     
                          </Table.Row>
                       ) 
                       }
                       </Fragment>
                  ))}
                 </Table.Body>
                </Table>
                </form>
                </div>
          );

        }
           
        
}
