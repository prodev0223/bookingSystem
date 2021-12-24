using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace booking.Application.Models
{
    public class APIResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public object AnyData { get; set; }

        public APIResponse(MESSAGE message, bool IsSuccess = true)
        {
            Success = IsSuccess;
            Message = GetEnumDescription(message);
        }

        public APIResponse(string message, bool IsSuccess = true)
        {
            Message = message;
            Success = IsSuccess;
        }

        public void UpdateStatus(MESSAGE message, bool IsSuccess = false)
        {
            Success = IsSuccess;
            Message = GetEnumDescription(message);
        }

        public void UpdateStatus(string message, bool IsSuccess = false)
        {
            Message = message;
            Success = IsSuccess;
        }

        public string GetEnumDescription(Enum enumValue)
        {
            var fieldInfo = enumValue.GetType().GetField(enumValue.ToString());

            var descriptionAttributes = (DescriptionAttribute[])fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false);

            return descriptionAttributes.Length > 0 ? descriptionAttributes[0].Description : enumValue.ToString();
        }
    }

    public enum MESSAGE : int
    {
        [Description("NONE")]
        NONE = 0,

        [Description("Details saved successfilly")]
        SAVED = 1,

        [Description("Failed to save details")]
        SAVE_FAILED = 2,

        [Description("Details updated successfilly")]
        UPDATED = 3,

        [Description("Record deleted successfully")]
        DELETED = 4,

        [Description("Failed to update details")]
        UPDATE_FAILED = 5,

        [Description("Failed to delete record")]
        DELETE_FAILED = 6,

        [Description("Details loaded successfilly")]
        LOADED = 7,

        [Description("Failed to load details")]
        LOAD_FAILED = 8,

        [Description("Invalid data,please check")]
        INVALID = 9,

        [Description("INTERNAL_SERVER_ERROR")]
        INTERNAL_SERVER_ERROR = 10,

        [Description("Your'e not authorized to perform this action")]
        UNAUTHORISE = 11,

        [Description("Data not found")]
        DATA_NOT_FOUND = 12,

        [Description("User logged out successfully")]
        LOGGED_OUT = 13,
    }
}