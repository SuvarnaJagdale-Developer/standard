using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Talent.Common.Aws;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _tempFolder;
        private IAwsService _awsService;

        public FileService(IHostingEnvironment environment, 
            IAwsService awsService)
        {
            _environment = environment;
            _tempFolder = "images\\";
            _awsService = awsService;
        }

        public async Task<string> GetFileURL(string id, FileType type)
        {
            string fileURL = "";
            try
            {
                fileURL = await _awsService.GetPresignedUrlObject(id, "mytalentimagebucket");
                return fileURL;
            }
            catch
            {
                return null;
            }


            //Your code here;
           // throw new NotImplementedException();
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            //string fileName = null;
            //if (file != null && type == FileType.ProfilePhoto)
            //{
            //    fileName = $@"img{DateTime.Now.Ticks}";
            //    var result = await _awsService.PutFileToS3(fileName, file.OpenReadStream(), "mytalentimagebucket", true);
            //    if (!result) fileName = null;
            //}
            //return fileName;

            //var uniqueFileName = "";
            //string pathWeb = "";
            //var path = "";
            //pathWeb = _environment.WebRootPath;
            //string pathValue = pathWeb + _tempFolder;
            //if (file != null && type == FileType.ProfilePhoto && pathWeb != "")
            //{
            //    uniqueFileName = $@"{DateTime.Now.Ticks}_" + file.FileName;
            //    path = pathValue + uniqueFileName;
            //    using (var fileStream = new FileStream(path, FileMode.Create))
            //    {
            //        await file.CopyToAsync(fileStream);
            //        if (!await _awsService.PutFileToS3(path, fileStream, "mytalentimagebucket"))
            //        {
            //            path = "";
            //        }
            //    }
            //}
            //return path;



            var uniqueFileName = "";
            string pathWeb = "";
            pathWeb = _environment.WebRootPath;
            string pathValue = pathWeb + _tempFolder;
            uniqueFileName = $@"{DateTime.Now.Ticks}_" + file.FileName;
            var path = pathValue + uniqueFileName;
            if (file != null && type == FileType.ProfilePhoto && pathWeb != "")
            {
                using (var fileStream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                    if (!await _awsService.PutFileToS3(path, fileStream, "mytalentimagebucket"))
                    {
                        path = "";
                    }
                }
            }
            return path;


        }

        public async Task<bool> DeleteFile(string id, FileType type)
        {
            //Your code here;
            throw new NotImplementedException();
        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        
        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion
    }
}
