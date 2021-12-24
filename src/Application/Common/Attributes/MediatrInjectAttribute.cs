using System;
using booking.Domain.Enums;

namespace booking.Application.Common.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class MediatrInjectAttribute: Attribute
    {
        public MediatrInjectAttribute(params MediatrServiceType[] serviceTypes)
        {
        }
    }
    [AttributeUsage(AttributeTargets.Property)]
    public class UniqueAttribute: Attribute
    {
        public UniqueAttribute(string applicationContextName)
        {
            
        }
    }
}