import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")

        this.state = {
            

            loadNumber: 5,
            loadPosition: 250,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            companyDetails: null
        }
        this.updateWithoutSave = this.updateWithoutSave.bind(this)
       // this.updateAndSaveData = this.updateAndSaveData.bind(this)
       this.loadData = this.loadData.bind(this)
        this.init = this.init.bind(this)
      //  this.loadCompanyData=this.loadCompanyData.bind(this);
      //  this.loadTalentCard=this.loadTalentCard.bind(this);
    };

    init() {
        console.log("Init")
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
       this.setState({ loaderData });//comment this
        
    }

    componentDidMount() {
        //window.addEventListener('scroll', this.handleScroll);
        this.init()
        this.loadData();
    };

   loadData() {
        this.loadCompanyData();
        this.loadTalentCard()
        //this.init()
    } 



    loadCompanyData() {
        console.log("Load Data")
        let companyData=""
        var cookies = Cookies.get('talentAuthToken');
        //console.log(cookies);
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {

                if (res.success == true) {
                    console.log("getDataSkill",res.employer)
                     companyData=res.employer.companyContact
                    console.log("company Data",companyData)

                    this.updateWithoutSave(companyData)
                }
              
              
            }.bind(this)
        })
       // this.init()
    }
loadTalentCard()
{

   
    console.log("Load Data card",this.state.loadPosition)
    let companyData=""
    var cookies = Cookies.get('talentAuthToken');
    //console.log(cookies);
    $.ajax({
        url: 'http://localhost:60290/profile/profile/getTalent',
        headers: {
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        },
        type: "GET",
        data: { position: this.state.loadPosition, number: this.state.loadNumber},
        contentType: "application/json",
        dataType: "json",
        success: function (res) {
            let newFeedData = this.state.feedData;
            let newLoadPosition = this.state.loadPosition;
            if (res.data) {
                newFeedData = newFeedData.concat(res.data);
                newLoadPosition += this.state.loadNumber;
                console.log(newFeedData);
                console.log(newLoadPosition);
            }
            console.log(res);
            this.setState({
                feedData: newFeedData,
                loadPosition: newLoadPosition
            });
            //this.updateWithoutSave(companyDetails)
        }.bind(this),
        error: function (res) {
            console.log(res.status)
        }
    })
  }
    updateWithoutSave(newValues) {
        let newProfile = Object.assign({}, this.state.companyDetails, newValues)
        this.setState({
            companyDetails: newProfile
        })
        console.log("Update without Save", this.setState.companyDetails)
    }

    updateAndSaveData(newValues) {
        let newProfile = Object.assign({}, this.state.talentFeedData, newValues)
        console.log("New Profile",talentFeedData)
        this.setState({
            talentFeedData: newProfile
        }, this.saveProfile)
       
    }

    render() {

        console.log("Load")
        return (

                <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                    
                    <div className="ui grid talent-feed container">
                        <div className="four wide column">
                            <CompanyProfile 
                            companyProfileData={this.state.companyDetails} 
                            />
                        </div>
                        <div className="eight wide column">
                        {this.renderTalents()}
                                    <p id="load-more-loading">
                                        <img src="/images/rolling.gif" alt="Loading…" />
                                        </p>
                        </div>
                        <div className="four wide column">
                            <div className="ui card">
                           <FollowingSuggestion/>
                            </div>
                        </div>
                    </div>
                </BodyWrapper>
            )
     }

    renderTalents() {
        const { feedData } = this.state;

        const talentList = feedData.map(talent =>
            <TalentCard key={talent.id} id={talent.id} talentData={talent} />);

        return (talentList && talentList.length > 0)
            ? talentList
            : <b>There are no talents found for your recruitment company</b>
    }
}