using Cerverus.Features.Features.OrganizationalStructure.Shared;
using ExcelDataReader;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Cerverus.Features.Features.OrganizationalStructure.Location.AppendLocations;

[ApiController]
[Route("api/locations/")]
public sealed class AppendLocationController(IMessageBus bus): ControllerBase
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
    public async Task<IActionResult> AppendLocationsFromFile(IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided");
        var appendLocations = await AppendLocationsExcelReader.ReadFile(file);
        foreach (var appendLocation in appendLocations)
        {
            await bus.SendAsync(appendLocation);
        }
        
        return Ok("File processed successfully");
    }

    private static class AppendLocationsExcelReader
    {
        public static async  Task<List<AppendHierarchyItems>> ReadFile(IFormFile file)
        {
            var appendHierarchyItems = new List<AppendHierarchyItems>();
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            using var reader = ExcelReaderFactory.CreateReader(stream);
            do
            {
                var cmd = ReadWorkingSheet(reader);
                if(cmd != null)
                    appendHierarchyItems.Add(cmd);
            } while (reader.NextResult());
            return appendHierarchyItems;
        }

        private static AppendHierarchyItems? ReadWorkingSheet(IExcelDataReader dataReader)
        {
            var worksheetProperties = GetWorksheetProperties(dataReader);
            if(worksheetProperties == null)
                return null;
            var appendHierarchyItems = new List<AppendHierarchyItem>();
            while (dataReader.Read())
            {
                var appendLocation = ReadAppendLocation(dataReader, worksheetProperties);
                if(appendLocation != null)
                    appendHierarchyItems.Add(appendLocation);
            }

            return appendHierarchyItems.Any() ? new AppendHierarchyItems(appendHierarchyItems) : null;
        }

        private static AppendHierarchyItem? ReadAppendLocation(IExcelDataReader dataReader, WorksheetProperties worksheetProperties)
        {
            var id = dataReader.GetString(worksheetProperties.IdColumnIndex);
            if(string.IsNullOrWhiteSpace(id))
                return null;
            var type = ParseHierarchicalItemType(dataReader.GetString(worksheetProperties.TypeColumnIndex));
            var parentId = ReadCell(worksheetProperties.ParentIdColumnIndex);
            var description = ReadCell(worksheetProperties.DescriptionColumnIndex);
            var ipAddress = ReadCell(worksheetProperties.DefaultCameraAdminSettingsIpAddressColumnIndex);
            var userName = ReadCell(worksheetProperties.DefaultCameraAdminSettingsUserNameColumnIndex)?.ToString() ?? string.Empty;
            var password = ReadCell(worksheetProperties.DefaultCameraAdminSettingsPasswordColumnIndex);
            var captureRecurrencePattern = dataReader.GetString(worksheetProperties.DefaultCameraAdminSettingsCaptureRecurrencePatternColumnIndex);
            
            return new AppendHierarchyItem(
                type,
                id,
                parentId,
                description,
                new CameraAdminSettings(ipAddress, new CameraCredentials(userName, password), captureRecurrencePattern),
                new CameraFunctionalSettings(new List<CameraFilter>())
                );
            HierarchicalItemType ParseHierarchicalItemType(string value, HierarchicalItemType defaultValue = HierarchicalItemType.Location) => Enum.TryParse(value, true, out HierarchicalItemType type) ? type : defaultValue;
            string ReadCell(int cellIndex) => dataReader.GetValue(cellIndex)?.ToString() ?? string.Empty;
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
            private static readonly Dictionary<string, string> PropertyNameMapp = new Dictionary<string, string>
            {
                {"Type", "TypeColumnIndex"},
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
                { "CameraFilters", "DefaultCameraFunctionalSettingsColumnIndex" },
              
            };
            public void SetPropertyValue(string propertyName, int value)
            {
                if(!PropertyNameMapp.ContainsKey(propertyName.Trim()))
                    return;
                var property = PropertyNameMapp[propertyName.Trim()];
                GetType().GetProperty(property)?.SetValue(this, value);
            }

            public int TypeColumnIndex { get; set; } = -1;
            public int IdColumnIndex { get; set; } = -1;
            public int ParentIdColumnIndex { get; set; } = -1;
            public int DescriptionColumnIndex { get; set; } = -1;
            public int DefaultCameraAdminSettingsIpAddressColumnIndex { get; set; } = -1;
            public int DefaultCameraAdminSettingsUserNameColumnIndex { get; set; }= -1;
            public int DefaultCameraAdminSettingsPasswordColumnIndex { get; set; }= -1;
            public int DefaultCameraAdminSettingsCaptureRecurrencePatternColumnIndex { get; set; }= -1;
            public int DefaultCameraFunctionalSettingsColumnIndex { get; set; }= -1;


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