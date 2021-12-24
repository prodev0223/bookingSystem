using booking.Application.Common.Exceptions;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using MediatR;
using System;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Rooms.Commands.UpdateRoom;
using booking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Common.Behaviours
{
    public class PermissionBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IIdentityService    _identityService;

        public PermissionBehaviour(
                ICurrentUserService currentUserService,
                IIdentityService    identityService
            )
        {
            _currentUserService = currentUserService;
            _identityService    = identityService;
        }

        public async Task<TResponse> Handle(
            TRequest                          request,
            CancellationToken                 cancellationToken,
            RequestHandlerDelegate<TResponse> next)
        {
                //.GetCustomAttributes<PermissionAttribute>();

            return await next();
        }
    }
}