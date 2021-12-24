using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using booking.Application.UserPermissions.Commands.CreatePermissionSet;
using booking.Application.UserPermissions.Queries.GetPermissionNameList;
using booking.Application.UserRoles.Queries.GetMyRoles;
using booking.Application.Users.Commands;
using booking.Application.Users.Queries.GetUsers;
using booking.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.Users
{
    using static Testing;
    public class GetUserPaged: TestBase
    {
        
        [Test]
        public async Task ShouldMakeUserList()
        {
            
            var uid = await RunAsAdministratorAsync();

            int n = 1000;
            for (int i = 0; i < n; i++)
            {
                CreateUserSimpleCommand createUserSimpleCommand = new()
                {
                    Username = $"username{i}",
                    Password = "asdfwf234234asfaS!df234",
                };

                var result2 = await SendAsync(createUserSimpleCommand);
            }
            
            GetAllUsersWithPage query = new()
            {
                PageNumber = 1,
                PageSize = 1,
            };
            var result = await SendAsync(query);

            result.PageIndex.Should().Be(1);
            result.TotalCount.Should().Be(n + 1);
        }
    }
}
