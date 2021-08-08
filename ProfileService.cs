using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<UserSkill> _userSkillRepository;
        IRepository<ExperienceViewModel> _userExperienceRepository;

        IRepository<User> _userRepository; 
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;

        
            public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<UserSkill> userSkillRepository,
                              IRepository<ExperienceViewModel> userExperienceRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
            _userSkillRepository = userSkillRepository;
            _userExperienceRepository = userExperienceRepository;
        }



        public async Task<string> AddNewLanguages(UserLanguage userLanguage)
        {
            try
            {
                var UId = Guid.NewGuid();
                var objectId = ObjectId.GenerateNewId().ToString();
              
                var newTalentUser = new UserLanguage()
                {
                   
                    Id = objectId,
                    IsDeleted = false,
                    UserId = userLanguage.UserId,
                    Language = userLanguage.Language,
                    LanguageLevel = userLanguage.LanguageLevel,

                };
              
                await _userLanguageRepository.Add(newTalentUser);

                return newTalentUser.Id;


            }
            catch(Exception e)
            {

                throw new NotImplementedException();
            }


            
        }

        public async Task<string> AddSkill(UserSkill skill)
        {
            try
            {
                var objectId = ObjectId.GenerateNewId().ToString();

                var newUserSkill = new UserSkill()
                {
                    Id = objectId,
                    IsDeleted = false,
                    UserId = skill.UserId,
                    Skill = skill.Skill,
                    ExperienceLevel = skill.ExperienceLevel
                };

                await _userSkillRepository.Add(newUserSkill);
                return newUserSkill.Id +" " +newUserSkill.Skill +" "+newUserSkill.ExperienceLevel;

            }
            catch(Exception e)
            {
                throw new NotImplementedException();

            }
        }
        public async Task<string> AddNewExperience(ExperienceViewModel experience)
        {

            var objectId = ObjectId.GenerateNewId().ToString();
            
            var newUserExperience = new ExperienceViewModel()
            {


                Id = objectId,
              
                UserId = _userAppContext.CurrentUserId,
                Company = experience.Company,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Start = experience.Start,
                End = experience.End,
                IsDeleted = false,
            };

            await _userExperienceRepository.Add(newUserExperience);
            return newUserExperience.Id;

        }

        public async Task<UserLanguage> GetLanguageById(string id)
        {

            return await _userLanguageRepository.GetByIdAsync(id);
                
           
        }
        public async Task DeleteLanguageById(string langauageId)
        {
            var langauage = await GetLanguageById(langauageId);
            langauage.IsDeleted = true;
            await _userLanguageRepository.Update(langauage);


        }
        public async Task<bool> UpdateLanguage(UserLanguage language)
        {

            try
            {
                if (language.Id != null)
                {
                    UserLanguage exsitingLanguageUser = await _userLanguageRepository.GetByIdAsync(language.Id);
                    exsitingLanguageUser.Language = language.Language;
                    exsitingLanguageUser.LanguageLevel = language.LanguageLevel;
                    await _userLanguageRepository.Update(exsitingLanguageUser);
                    return true;
                }
                return false;
            }
            catch (Exception e)
            {
                return false;
            }

                        
        }
        public async Task<bool> UpdateSkill(UserSkill skill)
        {
            try
            {
                UserSkill existingSkill = await _userSkillRepository.GetByIdAsync(skill.Id);
                if (skill.Id != null)
                {
                  
                    existingSkill.Skill = skill.Skill;
                    existingSkill.ExperienceLevel = skill.ExperienceLevel;
                    await _userSkillRepository.Update(existingSkill);
                    return true;
                }
                return false;
            }
            catch (Exception e)
            {
                throw new NotImplementedException();
            }
        }


        public async Task<string> UpdateExperience(ExperienceViewModel experience)
        {
            try
            {

                ExperienceViewModel existingexperience = await _userExperienceRepository.GetByIdAsync(experience.Id);
              
                if (experience.Id != null)
                {
                  


                    existingexperience.Company = experience.Company;
                    existingexperience.Position = experience.Position;
                    existingexperience.Responsibilities = experience.Responsibilities;
                    existingexperience.Start = experience.Start;
                    existingexperience.End = experience.End;

                }

                await _userExperienceRepository.Update(existingexperience);
                return existingexperience.Id;
           
            }
            catch (Exception e)
            {
                throw new NotImplementedException();
            }
        }




        public async Task DeleteSkill(string skillId)
        {
            var skill = await _userSkillRepository.GetByIdAsync(skillId);
            skill.IsDeleted = true;
            await _userSkillRepository.Update(skill);


        }



        public async Task DeleteExperience(string ExperienceId)
        {
            var exprience = await _userExperienceRepository.GetByIdAsync(ExperienceId);
            exprience.IsDeleted = true;
            await _userExperienceRepository.Update(exprience);


        }
        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
             {

            User userProfile;

             userProfile =await _userRepository.GetByIdAsync(Id);
            if (userProfile != null)
            {
                //var newlanguages = await _userLanguageRepository.Get(x => x.UserId == userProfile.Id && !x.IsDeleted);
              //  var addNewLanguages = newlanguages.Select(x => ViewModelFromLanguage(x)).ToList();

                var newlanguages = await _userLanguageRepository.Get(x => x.UserId == userProfile.Id && !x.IsDeleted);
                var newUserLanguages = newlanguages.Select(x => ViewModelFromLanguage(x)).ToList();

                var newSkill= await _userSkillRepository.Get(x => x.UserId == userProfile.Id && !x.IsDeleted);
                var newUserSkill=newSkill.Select(x => ViewModelFromSkill(x)).ToList();



                var newExperience = await _userExperienceRepository.Get(x => x.UserId == userProfile.Id && !x.IsDeleted);
                var newUserExperience = newExperience.Select(x => ViewModelFromExperience(x)).ToList();

                userProfile.ProfilePhotoUrl = string.IsNullOrWhiteSpace(userProfile.ProfilePhoto)
                          ? ""
                          : await _fileService.GetFileURL(userProfile.ProfilePhoto, FileType.ProfilePhoto);



                var result = new TalentProfileViewModel
                {

                    Id = userProfile.Id,
                    LinkedAccounts=userProfile.LinkedAccounts,
                    Description=userProfile.Description,
                    Summary=userProfile.Summary,
                    FirstName = userProfile.FirstName,
                    LastName = userProfile.LastName,
                    Email = userProfile.Email,
                    Phone=userProfile.Phone,
                    Address=userProfile.Address,
                    Nationality=userProfile.Nationality,
                    Languages = newUserLanguages,
                    Skills=newUserSkill,
                    Experience= newUserExperience,
                    VisaStatus=userProfile.VisaStatus,
                    VisaExpiryDate=userProfile.VisaExpiryDate,
                    ProfilePhoto = userProfile.ProfilePhoto,
                    ProfilePhotoUrl = userProfile.ProfilePhotoUrl,
                    JobSeekingStatus=userProfile.JobSeekingStatus,


                };
                              
             return result;
               
            }
         return null;



           
        }
        public async Task<TalentProfileViewModel> UpdateTalentPhoto(string talentId, IFormFile file)
        {

            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };
            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return null;
            }
            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();
            if (profile == null)
            {
                return null;
            }
            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);
            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;
                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }
                profile.ProfilePhoto = newFileName;
                var photoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);
                if (photoUrl == null)
                {
                    return null;
                }
                profile.ProfilePhotoUrl = photoUrl;
                await _userRepository.Update(profile);
                var result = new TalentProfileViewModel
                {
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl
                };
                return result;
            }
            return null;

        }









        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
          
            User existingUser = await _userRepository.GetByIdAsync(updaterId);
        
            existingUser.LinkedAccounts = model.LinkedAccounts;
            existingUser.Summary = model.Summary;
            existingUser.Description = model.Description;
           
            existingUser.FirstName = model.FirstName;
            existingUser.LastName = model.LastName;
            existingUser.Email = model.Email;
            existingUser.Phone = model.Phone;
            existingUser.Address = model.Address;
            existingUser.Nationality = model.Nationality;
            existingUser.VisaStatus = model.VisaStatus;
            existingUser.VisaExpiryDate = model.VisaExpiryDate;
            existingUser.JobSeekingStatus = model.JobSeekingStatus;
          //  existingUser.ProfilePhoto = model.ProfilePhoto;
           // existingUser.ProfilePhotoUrl = model.ProfilePhotoUrl;
            await _userRepository.Update(existingUser);
            return true;
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }



        //public async Task<string> UpdateTalentPhoto(string talentId, IFormFile file)
        //{
        //    var fileExtension = Path.GetExtension(file.FileName);
        //    List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

        //    if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
        //    {
        //        return "Unsupport file type: " + fileExtension;
        //    }

        //    var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

        //    if (profile == null)
        //    {
        //        return "Can't find talent: " + talentId;
        //    }

        //    var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

        //    if (!string.IsNullOrWhiteSpace(newFileName))
        //    {
        //        var oldFileName = profile.ProfilePhoto;

        //        if (!string.IsNullOrWhiteSpace(oldFileName))
        //        {
        //            await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
        //        }

        //        profile.ProfilePhoto = newFileName;
        //        profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

        //        await _userRepository.Update(profile);
        //        return null;
        //    }

        //    return "Save phote ";
        //}



        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        //public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        //{
        //    //Your code here;
        //    throw new NotImplementedException();
        //}

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            Employer profile = null;
            var employerID = employerOrJobId;
            if (forJob)
            {
                var job = await _jobRepository.GetByIdAsync(employerOrJobId);
                employerID = job.EmployerID;
            }

            profile = await _employerRepository.GetByIdAsync(employerID);
            var talentList = _userRepository.GetQueryable().Skip(position).Take(increment);

            if (profile != null)
            {
                var result = new List<TalentSnapshotViewModel>();

                foreach (var item in talentList)
                {
                    var photoId = "";
                    if (item.ProfilePhotoUrl != null)
                    {
                        photoId = item.ProfilePhotoUrl;
                    }

                    var videoUrl = "";
                    if (item.VideoName != null)
                    {
                        videoUrl = string.IsNullOrWhiteSpace(item.VideoName)
                                  ? ""
                                  : await _fileService.GetFileURL(item.VideoName, FileType.UserVideo);
                    }

                    var cvUrl = "";
                    if (item.CvName != null)
                    {
                        cvUrl = string.IsNullOrWhiteSpace(item.CvName)
                                  ? ""
                                  : await _fileService.GetFileURL(item.CvName, FileType.UserVideo);
                    }

                    var summary = "";
                    if (item.Summary != null)
                    {
                        summary = item.Summary;
                    }

                    // get current employment)
                    var currentEmployment = "";
                    if (item.Experience != null && item.Experience.Count > 0)
                    {
                        currentEmployment = item.Experience.First().Company;
                    }

                    var visa = "";
                    if (item.VisaStatus != null)
                    {
                        visa = item.VisaStatus;
                    }

                    // Hardcoded to Junior at the moment until source data 
                    var level = "not available";

                    List<string> skills = new List<string>();
                    if (item.Skills != null)
                    {
                        Console.WriteLine("Skills not null.");
                        skills = item.Skills.Select(aSkill => aSkill.Skill).ToList();
                        Console.WriteLine($"Count: {item.Skills.Count}");
                    }

                    var talentSnapshot = new TalentSnapshotViewModel
                    {
                        Id = item.Id,
                        Name = item.FirstName + ' ' + item.LastName,
                        PhotoId = photoId,
                        VideoUrl = videoUrl,
                        CVUrl = cvUrl,
                        CurrentEmployment = currentEmployment,
                        Level = level,
                        Skills = skills,
                        Summary = summary,
                        Visa = visa
                    };

                    result.Add(talentSnapshot);
                }

                return result;
            }

            return null;

        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

    #endregion

    #region Build Views from Model

    

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }
        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language)
        {
            return new AddLanguageViewModel
            {
                Id = language.Id,
                Level = language.LanguageLevel,
                Name = language.Language
            };
        }



        protected ExperienceViewModel ViewModelFromExperience(ExperienceViewModel experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Company=experience.Company,
                Position=experience.Position,
                Responsibilities=experience.Responsibilities,
                Start=experience.Start,
                End=experience.End
                
            };
        }



        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
