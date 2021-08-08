/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Grid,Image,Label } from 'semantic-ui-react';
import axios from 'axios';

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);
        const {profilePhoto,profilePhotoUrl} = props;

        const defaultImageSrc = '../../../../images/camera.png';

        // this.loadImages = this.loadImages.bind(this);
        // this.selectFileToUpload = this.selectFileToUpload.bind(this);
        // this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
        // this.removeFile = this.removeFile.bind(this);
        // this.fileUploadHandler = this.fileUploadHandler.bind(this);
        // this.maxFileSize = 2097152;
        // this.maxNoOfFiles = 5;

        // this.acceptedFileType = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
        // this.uploadIamge=this.uploadIamge.bind(this)

        this.state = {



            showEditSection: false,
            imageFile: null,
            imageSrc: defaultImageSrc,
            //addImage:{
          /*   selectedFile: [],
            selectedFileName: [],
            imageSrc: [],
            imageId: [],
            selectedRemoveFileId: [],
            currentNoOfFiles: 0 */
           // }
        }

        this.openEdit = this.openEdit.bind(this)
       this.closeEdit = this.closeEdit.bind(this)
    };
    openEdit () {
        this.setState({
            showEditSection: true
        })
    };

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    };
   
  

   
  uploadIamge()
  {
    let data = new FormData();
    data.append('file' +  this.state.imageId,this.state.selectedFileName);
    console.log("data",data)
    
    var cookies = Cookies.get('talentAuthToken');

    $.ajax({
        url: 'http://localhost:60290/profile/profile/UpdateEmployerPhoto',
        headers: {
            'Authorization': 'Bearer ' + cookies
        },
        type: "POST",
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function (res) {
            if (res.success) {
                this.loadImages(Id);
            } else {
                TalentUtil.notification.show(res.message, "error", null, null);
            }
        }.bind(this),
        error: function (res, status, error) {
            //Display error
            TalentUtil.notification.show("There is an error when updating Images - " + error, "error", null, null);
        }
    });
  
  }


    
    render() {
        
     
        const formData = new FormData();
         const showPreview = e => {
            if (!e.target.files || !e.target.files[0]) 
            {
                this.setState({
                    showEditSection: false
                })
                return;
            } 

            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                this.setState({
                    showEditSection: true,
                    imageFile,
                    imageSrc: x.target.result
                })  
            }
            reader.readAsDataURL(imageFile);
        } 

        const uploadPhoto = () => {
            formData.append('talentPhoto',this.state.imageFile);
            console.log("uploadPhoto",formData.entries().next().value);
            var cookies = Cookies.get('talentAuthToken');
         /*  console.log("Data",JSON.stringify(formData))
            $.ajax({
                url: 'http://localhost:60290/profile/profile/UpdateProfilePhoto',
                headers: {
                    'Authorization': 'Bearer ' + cookies
                },
                type: "POST",
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res.success) {
                        //this.loadImages(Id);
                    } else {
                        TalentUtil.notification.show(res.message, "error", null, null);
                    }
                }.bind(this),
                error: function (res, status, error) {
                    //Display error
                    TalentUtil.notification.show("There is an error when updating Images - " + error, "error", null, null);
                }
            });  */
 
         const config = {
                headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
                },
            }  
            
            axios.post(this.props.savePhotoUrl,formData,config)
            .then((res) => {
                TalentUtil.notification.show("Photo Uploaded sucessfully", "success", null, null)    
                console.log("response",res.data);
                let data = {};
                data["profilePhoto"] = res.data.profilePhoto.profilePhoto;
                data["profilePhotoUrl"] = res.data.profilePhoto.profilePhotoUrl;
                this.props.updateProfileData(data)        
            })
            .catch((err) => {
                TalentUtil.notification.show("Photo Not Uploaded", "error", null, null)
            });    
            this.closeEdit()
           
        }
                        

        return (
              
        this.state.showEditSection ? 
        (
            
        <div className='ui sixteen wide column'>
            <Grid columns='equal'>
                <Grid.Row>
                    
                    <Grid.Column>
                           
                    
                           
                            <Image
                                size='small'
                                src={this.props.imageId}
                                circular
                            ></Image> 
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                    </Grid.Column>
                    <Grid.Column>
                        <button type="button"  className="ui teal button" onClick={uploadPhoto}><i className="ui upload icon"></i>Upload</button>
                        <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button> 
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
        )
        : 
        (    
        <div className='ui sixteen wide column'>
            <Grid columns='equal'>
                <Grid.Row>
                    <Grid.Column>
                        <h3>Profile Photo</h3>                    
                    </Grid.Column>
                    <Grid.Column>
                        <div 
                            onClick={() => {
                            this.upload.click();
                            }}
                        >
                            <Image
                                size='small'
                                src={this.props.imageId ? this.props.imageId : this.state.imageSrc}
                                circular
                            ></Image>   
                        </div>
                        <input
                            id='myInput'
                            type='file'
                            name='file'
                            ref={(ref) => (this.upload = ref)}
                            style={{ display: "none" }}  
                            onChange={showPreview}                  
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                    </Grid.Column>
                    <Grid.Column>
                        { this.state.showEditSection ?    
                            (<button type="button"  className="ui teal button" ><i className="ui upload icon"></i>Upload</button>) : 
                            (<Label pointing>click on Photo To Change</Label>)
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
        )
      )
    }
}