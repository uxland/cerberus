using ExcelDataReader;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Features.Features.OrganizationalStructure.Location.AppendLocations;

[ApiController]
[Route("api/locations/")]
public sealed class AppendLocationController(ISender sender): ControllerBase
{
    public const string AppendLocationsCommand = "application/json;domain-model=AppendLocations;version=1.0.0";
    public const string AppendLocationCommand = "application/json;domain-model=AppendLocation;version=1.0.0";
    //[HttpPost]
    //[Consumes(AppendLocationsCommand)]
    /*public Task AppendLocations(AppendLocations command)
    {
        return sender.Send(command);
    }*/
        
   // [HttpPost]
    //[Consumes(AppendLocationCommand)]
    /*public Task AppendLocation(AppendLocation command)
    {
        return sender.Send(command);
    }*/

    [HttpPost]
    public async Task<IActionResult> AppenLocationsFromFile(IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided");
        var appendLocations = await AppendLocationsExcelReader.ReadFile(file);
        foreach (var appendLocation in appendLocations)
        {
            await sender.Send(appendLocation);
        }
        
        return Ok("File processed successfully");
    }

    private static class AppendLocationsExcelReader
    {
        public static async  Task<List<AppendLocations>> ReadFile(IFormFile file)
        {
            var appendLocations = new List<AppendLocations>();
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            using var reader = ExcelReaderFactory.CreateReader(stream);
            do
            {
                var cmd = ReadWorkingSheet(reader);
                if(cmd != null)
                    appendLocations.Add(cmd);
            } while (reader.NextResult());
            return appendLocations;
        }

        private static AppendLocations? ReadWorkingSheet(IExcelDataReader dataReader)
        {
            var worksheetProperties = GetWorksheetProperties(dataReader);
            if(worksheetProperties == null)
                return null;
            var appendLocations = new List<AppendLocation>();
            while (dataReader.Read())
            {
                var appendLocation = ReadAppendLocation(dataReader, worksheetProperties);
                if(appendLocation != null)
                    appendLocations.Add(appendLocation);
            }

            return appendLocations.Any() ? new AppendLocations(appendLocations) : null;
        }

        private static AppendLocation? ReadAppendLocation(IExcelDataReader dataReader, WorksheetProperties worksheetProperties)
        {
            var id = dataReader.GetString(worksheetProperties.IdColumnIndex);
            if(string.IsNullOrWhiteSpace(id))
                return null;
            return new AppendLocation(
                id,
                dataReader.GetString(worksheetProperties.ParentIdColumnIndex),
                dataReader.GetString(worksheetProperties.DescriptionColumnIndex),
                new CameraAdminSettings(
                    dataReader.GetString(worksheetProperties.DefaultCameraAdminSettingsIpAddressColumnIndex),
                    new CameraCredentials(
                        dataReader.GetString(worksheetProperties.DefaultCameraAdminSettingsUserNameColumnIndex),
                        dataReader.GetString(worksheetProperties.DefaultCameraAdminSettingsPasswordColumnIndex)
                    ),
                    dataReader.GetString(worksheetProperties
                        .DefaultCameraAdminSettingsCaptureRecurrencePatternColumnIndex)
                ),
                new CameraFunctionalSettings(
                    new List<CameraFilter>()
                ),
                ParseOverrideMode(dataReader.GetString(worksheetProperties.DefaultCameraAdminSettingsOverrideModeColumnIndex)),
                ParseOverrideMode(dataReader.GetString(worksheetProperties.DefaultCameraFunctionalSettingsOverrideModeColumnIndex))

            );
            OverrideMode ParseOverrideMode(string value, OverrideMode defaultValue = OverrideMode.Replace) => Enum.TryParse(value, true, out OverrideMode mode) ? mode : defaultValue;
        }
        private static WorksheetProperties? GetWorksheetProperties(IExcelDataReader dataReader)
        {
            var columns = dataReader.FieldCount;
            var worksheetProperties = new WorksheetProperties();
            while (dataReader.Read())
            {
                for (var i = 0; i < columns; i++)
                {
                    var columnName = dataReader.GetString(i);
                    
                    if(string.IsNullOrWhiteSpace(columnName))
                        continue;
                    worksheetProperties.SetPropertyValue(columnName, i);
                }
                if(worksheetProperties.IsSet)
                    return worksheetProperties;
            }

            return null;
        }

        private class WorksheetProperties
        {
            private static Dictionary<string, string> _propertyNameMapp = new Dictionary<string, string>
            {
                { "Id", "IdColumnIndex" },
                { "ParentId", "ParentIdColumnIndex" },
                { "Description", "DescriptionColumnIndex" },
                { "AdminSettings.IpAddress", "DefaultCameraAdminSettingsIpAddressColumnIndex" },
                { "AdminSettings.UserName", "DefaultCameraAdminSettingsUserNameColumnIndex" },
                { "AdminSettings.Password", "DefaultCameraAdminSettingsPasswordColumnIndex" },
                {
                    "AdminSettings.CaptureRecurrencePattern",
                    "DefaultCameraAdminSettingsCaptureRecurrencePatternColumnIndex"
                },
                { "AdminSettings.OverrideMode", "DefaultCameraAdminSettingsOverrideModeColumnIndex" },
                { "CameraFilters", "DefaultCameraFunctionalSettingsColumnIndex" },
                { "CameraFilters.OverrideMode", "DefaultCameraFunctionalSettingsOverrideModeColumnIndex" }
            };
            public void SetPropertyValue(string propertyName, int value)
            {
                var property = _propertyNameMapp[propertyName.Trim()];
                GetType().GetProperty(property)?.SetValue(this, value);
            }

            public int IdColumnIndex { get; set; } = -1;
            public int ParentIdColumnIndex { get; set; } = -1;
            public int DescriptionColumnIndex { get; set; } = -1;
            public int DefaultCameraAdminSettingsIpAddressColumnIndex { get; set; } = -1;
            public int DefaultCameraAdminSettingsUserNameColumnIndex { get; set; }= -1;
            public int DefaultCameraAdminSettingsPasswordColumnIndex { get; set; }= -1;
            public int DefaultCameraAdminSettingsCaptureRecurrencePatternColumnIndex { get; set; }= -1;
            public int DefaultCameraAdminSettingsOverrideModeColumnIndex { get; set; }= -1;
            public int DefaultCameraFunctionalSettingsColumnIndex { get; set; }= -1;
            public int DefaultCameraFunctionalSettingsOverrideModeColumnIndex { get; set; }= -1;

            public bool IsSet
            {
                get
                {
                    foreach (var propertyInfo in GetType().GetProperties())
                    {
                        if(propertyInfo.PropertyType != typeof(int))
                            continue;
                        var value = (int)(propertyInfo.GetValue(this) ?? -1);
                        if (value == -1)
                            return false;
                    }

                    return true;
                }
            }
        }
        
    }
    
   
}