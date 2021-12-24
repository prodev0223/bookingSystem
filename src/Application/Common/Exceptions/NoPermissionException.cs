using System;

namespace booking.Application.Common.Exceptions
{
    public class NoPermissionException : Exception
    {
        public NoPermissionException(string message)
            : base(message)
        {
        }
    }
}