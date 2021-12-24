using System;
using booking.Domain.Enums;

namespace booking.Application.Common.Security
{
    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public class PermissionAttribute : Attribute
    {
        // See the attribute guidelines at 
        //  http://go.microsoft.com/fwlink/?LinkId=85236
        public PermissionAttribute(params UserPermission[] u)
        {
            UserPermission = u;
        }

        public UserPermission[] UserPermission { get; }
    }
}