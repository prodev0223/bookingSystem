using System.Collections.Generic;
using booking.Domain.Entities;
using booking.Domain.ValueObjects;
using booking.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Domain.Enums;

namespace booking.Infrastructure.Persistence
{
    public static class ApplicationDbContextSeed
    {
        public static async Task<string> SeedDefaultUserAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            var administratorRole = new IdentityRole("Administrator");

            if (roleManager.Roles.All(r => r.Name != administratorRole.Name))
            {
                await roleManager.CreateAsync(administratorRole);
            }

            var administrator = new ApplicationUser { UserName = "administrator@localhost", Email = "administrator@localhost" };

            if (userManager.Users.All(u => u.UserName != administrator.UserName))
            {
                await userManager.CreateAsync(administrator, "Administrator1!");
                await userManager.AddToRolesAsync(administrator, new [] { administratorRole.Name });
                var adminUserId = administrator.Id;
                return adminUserId;
            }

            return "";
        }

        public static async Task SeedSampleDataAsync(ApplicationDbContext context)
        {
            // Seed, if necessary
            if (!context.TodoLists.Any())
            {
                context.TodoLists.Add(new TodoList
                {
                    Title = "Shopping",
                    Colour = Colour.Blue,
                    Items =
                    {
                        new TodoItem { Title = "Apples", Done = true },
                        new TodoItem { Title = "Milk", Done = true },
                        new TodoItem { Title = "Bread", Done = true },
                        new TodoItem { Title = "Toilet paper" },
                        new TodoItem { Title = "Pasta" },
                        new TodoItem { Title = "Tissues" },
                        new TodoItem { Title = "Tuna" },
                        new TodoItem { Title = "Water" }
                    }
                });

                await context.SaveChangesAsync();
            }
        }

        public static async Task SeedSuperRole(ApplicationDbContext context, string userId)
        {
            // Seed, if necessary
            if (!context.UserGroups.Any())
            {
                var userRole = new UserRole
                {
                    Name = "SuperRole",
                    RoomSet = new RoomSet
                    {
                        Name = "SuperPermission",
                        AllRooms = true,
                        SoftwareSystem = true,
                    },
                    PermissionSet = new PermissionSet
                    {
                        Name = "AllPermission",
                        Permissions = { UserPermission.AllPermission }
                    }
                };
                var superGroup = new UserGroup()
                {
                    Name = "SuperUserGroup",
                    UserRoles = new List<UserRole>(){userRole},
                };
                context.UserGroups.Add(superGroup);
                
                await context.SaveChangesAsync();
                
                var superGroupId = superGroup.Id;
                context.UserGroupApplicationUsers.Add(
                    new UserGroupApplicationUser()
                    {
                        UserGroupId = superGroupId,
                        ApplicationUserId = userId,
                    });
                await context.SaveChangesAsync();
            }
        }
    }
}
