/* Experience section */
import React, { Fragment  } from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Table, Button, Icon, Grid,Segment,Menu,Dropdown} from 'semantic-ui-react';
import { BlockMapBuilder } from 'draft-js';
import moment from "moment";

export default class Experience extends React.Component {
    constructor(props) {
        super(props);
       
        this.state = {
          editcompanyId:"",
            addExperience:{
                id: "",
                Company:"",
                Position:"",
                Responsibilities:"",
              
                Start:"",
                End:""
               
               },
                showEditSection: false,
                showRowSection:false,
               
            }

            this.openNew = this.openNew.bind(this)
            this.closeEdit = this.closeEdit.bind(this)
            this.saveData=this.saveData.bind(this)
            this.handleChange = this.handleChange.bind(this)
          //  this.handleChange=this.handleChange.bind(this)
            this.openEdit = this.openEdit.bind(this)
          
          
          
      
    }



   


    openEdit(experiences) {
      console.log("Skills Not Updated",experiences.id)
 
       this.setState({
      
           showRowSection:true,
           editcompanyId:experiences.id,

             addExperience:{
                id: experiences.id,
                Company:experiences.company,
                Position:experiences.position,
                Responsibilities:experiences.responsibilities,
                Start:experiences.start,
                End:experiences.end
               
               }, 
           
        // addeOrUpdate:"Update"
       }) 
     }
    
    openNew() {
      
      //  console.log("new Open" +this.props.experienceData),
        this.setState({
            showEditSection: true,

          addExperience:{
                id: "",
                Company:"",
                Position:"",
                Responsibilities:"",
                Start:"",
                End:""
               
               }, 
               
            
        })
     
    }
    saveData()
    {
        console.log("saveData",JSON.stringify(this.state.addExperience))
    
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
          url: 'http://localhost:60290/profile/profile/addNewExperience',
          headers: {
              'Authorization': 'Bearer ' + cookies,
              'Content-Type': 'application/json'
          },
         
          type: "POST",
          data: JSON.stringify(this.state.addExperience),
          success: function (res) {

            console.log("Load Data",res)
                if (res.success == true) {
                  console.log("getDataSkill",res.data)
                  if (this.state.createOrUpdate === "Create")
                    {
                        TalentUtil.notification.show("Experience added sucessfully", "success", null, null)
                    }                    
                    else
                    {
                        TalentUtil.notification.show("Experience updated sucessfully", "success", null, null)
                    } 
                  this.props.loadData()
      
                  } 
              else {
                  TalentUtil.notification.show("Experience not update successfully", "error", null, null)
              }
          
          
          
          }.bind(this),
            error: function (res, a, b) {
              console.log(res)
              console.log(a)
              console.log(b)
          }  
          }); 
           this.setState({showEditSection: false})  
           this.setState({ editcompanyId:" "})  
          }
  
          deleteExperience(experiencesId) 
          {

            var cookies = Cookies.get('talentAuthToken');
            $.ajax({
                url: 'http://localhost:60290/profile/profile/DeleteExperience',
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "POST",
                data: JSON.stringify(experiencesId),
                success: function (res) {
                    console.log(res)
                    if (res.success == true) 
                    { 
                      TalentUtil.notification.show("Deleted Record sucessfully", "success", null, null)
                      this.props.loadData()
                    }                  
                           
                     else {
                            TalentUtil.notification.show("Record did not deleted successfully", "error", null, null)
                 }
                }.bind(this),
                error: function (res, a, b) {
                    console.log(res)
                    console.log(a)
                    console.log(b)
                }
            })
        }
        

        
        handleChange(event) {
          console.log("Handel Chage evenet")
            const data = Object.assign({},this.state.addExperience)
            data[event.target.name] = event.target.value
            this.setState({
             addExperience:data
                })
              console.log("set",this.state.addExperience);
         }


        

    closeEdit() {
        console.log("close")
              this.setState({
                editcompanyId:"",
                showEditSection: false,
              })
          }
    
    render() {
        return (
            
            this.state.showEditSection ? this.renderNew() : this.renderDisplay()
        )
    }

    renderNew() {

       
         return(
             <div class='row'>
               <div className='ui sixteen wide column'>
                    <Grid columns='equal'>
                     
                      <Grid.Row>
                      <Grid.Column>
                      
                      <label style={{frontWeight:"bold", forntSize:"small",paddingBottom:"10px"}}>Company:</label> 
                       <ChildSingleInput
                        inputType="text"
                        name="Company"
                        value={this.state.addExperience.Company}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="company"
                        errorMessage="Please enter a valid Company"/>
                        </Grid.Column>



                        <Grid.Column>
                        <label style={{frontWeight:"bold", forntSize:"small",paddingBottom:"10px"}}>Position:</label> 
                      <ChildSingleInput
                        inputType="text"
                        name="Position"
                        value={this.state.addExperience.Position}
                       controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Position"
                        errorMessage="Please enter a valid Position"/>
                        </Grid.Column>
                  
                     
                        </Grid.Row>
                             
                     <Grid.Row>
                     <Grid.Column>
                     <label style={{frontWeight:"bold", forntSize:"small",paddingBottom:"10px"}}>Start:</label>   
                       <ChildSingleInput
                        inputType="date"
                        name="Start"
                        value={this.state.addExperience.Start}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Start"
                        errorMessage="Please enter a valid startDate"/>
                        </Grid.Column>



                        <Grid.Column>
                        <label style={{frontWeight:"bold", forntSize:"small",paddingBottom:"10px"}}> End:</label>     
                      <ChildSingleInput
                        inputType="date"
                        name="End"
                        value={this.state.addExperience.End}
                       controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="End"
                        errorMessage="Please enter a valid End Date"/>
                        </Grid.Column>
                  

                     </Grid.Row>


                     <Grid.Row>
                      
                     <Grid.Column>
                     <label style={{frontWeight:"bold", forntSize:"small",paddingBottom:"10px"}}> Responsibilities:</label> 
                      <ChildSingleInput
                        inputType="text"
                        name="Responsibilities"
                        value={this.state.addExperience.Responsibilities}
                       controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Responsibilities"
                        errorMessage="Please enter a valid Responsibilities"/>
                        </Grid.Column>
                
                     </Grid.Row>



                  <Grid.Row>
                     <Grid.Column> 
                        <button type="button" className="ui teal button" onClick={this.saveData}>Add</button>
                        <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
                        </Grid.Column>
                        </Grid.Row>


                        </Grid>
                      {this.renderDisplay()}
                      </div>
                      </div>
                      )
            }


            renderDisplay()
            {
             return (
 
                <div className='ui sixteen wide column'>
                 <h4> </h4>

                 <form>
            <Table> 
            <Table.Header> 
            <Table.Row>
           
            <Table.HeaderCell>Company</Table.HeaderCell>
            <Table.HeaderCell>Position</Table.HeaderCell>
            <Table.HeaderCell>Responibilities</Table.HeaderCell>
            <Table.HeaderCell>Start</Table.HeaderCell>
            <Table.HeaderCell>End</Table.HeaderCell>
            <Table.HeaderCell>
            <button type="button" className="ui teal button" onClick={this.openNew}>
            <Icon name='plus'/>
              Add</button>
            </Table.HeaderCell>
              </Table.Row> 
                </Table.Header>
                
            <Table.Body>
                {this.props.experienceData.map((experiences) => (
                      
                      <Fragment>

{/* //this.state.showRowSection  */}
                           {this.state.editcompanyId===experiences.id ?(
                             <Table.Row>
 
               <Table.Cell colSpan="6"> 
                        <Grid columns='equal'>
                     
                         <Grid.Row>
                         <Grid.Column>
                     
                         <label style={{frontWeight:"bold", forntSize:"small",paddingBottom:"10px"}}>Company:</label>  
                      <ChildSingleInput
                       inputType="text"
                       name="Company"
                       value={this.state.addExperience.Company}
                       controlFunc={this.handleChange}
                       maxLength={80}
                       placeholder="company"
                       errorMessage="Please enter a valid Company"/>
                       </Grid.Column>


                       <Grid.Column>
                       <label style={{frontWeight:"bold", forntSize:"small",paddingBottom:"10px"}}>Position:</label> 
                      <ChildSingleInput
                        inputType="text"
                        name="Position"
                        value={this.state.addExperience.Position}
                       controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Position"
                        errorMessage="Please enter a valid Position"/>
                        </Grid.Column>
                        </Grid.Row>
                       
                        <Grid.Row>
                       <Grid.Column>
                       <label style={{frontWeight:"bold", forntSize:"small",paddingBottom:"10px"}}>Start Date:</label> 
                       <ChildSingleInput
                        inputType="date"
                        name="Start"
                        //value={this.state.addExperience.Start}
                        
                        value={moment(experiences.start).format("DD/MM/YYYY")}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="Start"
                        errorMessage="Please enter a valid startDate"/>
                        </Grid.Column>



                        <Grid.Column>
                        <label style={{frontWeight:"bold", forntSize:"small",paddingBottom:"10px"}}>End Date:</label>   
                      <ChildSingleInput
                        inputType="date"
                        name="End"
                        //value={this.state.addExperience.End}
                       value={moment(experiences.End).format("DD/MM/YYYY")}
                     
                       controlFunc={this.handleChange}
                        maxLength={80}
                        placeholder="End"
                        errorMessage="Please enter a valid End Date"/>
                        </Grid.Column>
                  

                     </Grid.Row>
                      
                     <Grid.Row>
                      
                      <Grid.Column>
                        <label style={{frontWeight:"bold", forntSize:"small",paddingBottom:"10px"}}>Responsibilities</label>
                    
                       <ChildSingleInput
                         inputType="text"
                         name="Responsibilities"
                         value={this.state.addExperience.Responsibilities}
                        controlFunc={this.handleChange}
                         maxLength={80}
                         placeholder="Responsibilities"
                         errorMessage="Please enter a valid Responsibilities"/>
                         </Grid.Column>
                   
 
 
                      </Grid.Row>
                                            
                       <Grid.Row>

                     <Grid.Column> 

                


                        <button type="button" class="ui blue basic button" onClick={this.saveData}>Update</button>
                        <button type="button"class="ui red basic button" onClick={this.closeEdit}>Cancel</button>
                        </Grid.Column>
                        </Grid.Row>


                        </Grid>

                        </Table.Cell>
                            
                                 </Table.Row>
                             ) :(
                             <Table.Row key={experiences.id}>
                      
                      
                       <Table.Cell>{experiences.company}</Table.Cell>
                       <Table.Cell>{experiences.position}</Table.Cell>
                       <Table.Cell>{experiences.responsibilities}</Table.Cell>
                      
                       <Table.Cell> {moment(experiences.start).format("DD MMM,YYYY")}</Table.Cell>
                       <Table.Cell>{moment(experiences.end).format("DD MMM,YYYY")}</Table.Cell>
                      <Table.Cell> <Icon name='pencil alternate' onClick={()=>this.openEdit(experiences)}/>
                      <i className="delete icon" onClick={()=>this.deleteExperience(experiences.id)}></i></Table.Cell>
                        
                     </Table.Row>
                  
                              ) }
                      </Fragment>
                      
                      
                      
                     
                 ))} 
                 </Table.Body> 
                </Table>
                 </form>
                </div>
          );

        }
 





   
}

