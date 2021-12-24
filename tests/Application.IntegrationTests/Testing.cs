using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Bogus;
using booking.Application.Common.Interfaces;
using booking.Application.Rooms.Commands.CreateRooms;
using booking.Application.RoomSets.Commands.CreateRoomSet;
using booking.Domain.Entities;
using booking.Domain.Enums;
using booking.Infrastructure.Identity;
using booking.Infrastructure.Persistence;
using booking.Infrastructure.Persistence.Migrations;
using booking.WebUI;
using Castle.Components.DictionaryAdapter;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using NUnit.Framework;
using Respawn;
using Serilog;

namespace booking.Application.IntegrationTests
{
    [SetUpFixture]
    public class Testing
    {
        private static IConfigurationRoot   _configuration;
        private static IServiceScopeFactory _scopeFactory;
        private static Checkpoint           _checkpoint;
        private static string               _currentUserId;
        private static int _numberOfPresetRooms = 10;
        private static List<int> _presetRoomsIds = new();
        private static List<Room> _presetRooms = new();
        private static List<int> _roomSetIds = new();

        [OneTimeSetUp]
        public async Task RunBeforeAnyTests()
        {
            Log.Logger = new LoggerConfiguration()
              .WriteTo.SQLite( "/home/his/unittest.db", "Log", storeTimestampInUtc:false)
              .WriteTo.Console()
              .CreateLogger();
            
            var builder = new ConfigurationBuilder()
                
                         .SetBasePath(Directory.GetCurrentDirectory())
                         .AddJsonFile("appsettings.json", true, true)
                         .AddEnvironmentVariables();

            _configuration = builder.Build();

            var startup = new Startup(_configuration);

            var services = new ServiceCollection();

            services.AddSingleton(Mock.Of<IWebHostEnvironment>(w =>
                                                                   w.EnvironmentName == "Development" &&
                                                                   w.ApplicationName == "booking.WebUI"));

            services.AddLogging(builder => builder.AddSerilog(dispose:true));

            startup.ConfigureServices(services);

            // Replace service registration for ICurrentUserService
            // Remove existing registration
            var currentUserServiceDescriptor = services.FirstOrDefault(d =>
                                                                           d.ServiceType == typeof(ICurrentUserService));

            services.Remove(currentUserServiceDescriptor);

            // Register testing version
            services.AddTransient(provider =>
                                      Mock.Of<ICurrentUserService>(s => s.UserId == _currentUserId));

            _scopeFactory = services.BuildServiceProvider().GetService<IServiceScopeFactory>();

            _checkpoint = new Checkpoint
            {
                TablesToIgnore = new[] {"__EFMigrationsHistory"}
            };

            using var scope = _scopeFactory.CreateScope();

            EnsureDatabase();
            await MakeRooms(_numberOfPresetRooms);

            await MakeRoomSet(0, _presetRoomsIds);
        }

        private static void EnsureDatabase()
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetService<ApplicationDbContext>();

            context.Database.Migrate();
        }

        public static async Task<TResponse> SendAsync<TResponse>(IRequest<TResponse> request)
        {
            using var scope = _scopeFactory.CreateScope();

            var mediator = scope.ServiceProvider.GetService<ISender>();

            return await mediator.Send(request);
        }

        public static async Task<string> RunAsDefaultUserAsync()
        {
            
            var permSet = new PermissionSet {Permissions = {UserPermission.AllPermission}};

            var roomSet = new RoomSet {AllRooms = true};

            var roleSuperAdmin = new UserRole
            {
                Name       = "SuperAdmin",
                PermissionSet = permSet,
                RoomSet   =  roomSet,
            };

            using var scope = _scopeFactory.CreateScope();

            var dbcontext = scope.ServiceProvider.GetService<ApplicationDbContext>();
            
            dbcontext.AppUserRoles.Add(roleSuperAdmin);
            await dbcontext.SaveChangesAsync();

            var userId = await RunAsUserAsync("test@local", "Testing1234!");

            //await AddMeToSimpleUserGroup(userId);
            return userId;
        }
        public static async Task SeedDatabase(string userId)
        {
            using var scope = _scopeFactory.CreateScope();
            var applicationDbContext = scope.ServiceProvider.GetService<ApplicationDbContext>();
            await ApplicationDbContextSeed.SeedSuperRole(applicationDbContext, userId);
        }
        
        public static async Task<string> RunAsDefaultUserWithRoomSetAsync(IList<int> userRoleIds)
        {
            return await RunAsUserAsync("test2@local", "Testing1234!");
        }

        public static async Task<string> RunAsAdministratorAsync()
        {
            string userId = await RunAsUserAsync("administrator@local", "Administrator1234!");
            await SeedDatabase(userId);
            return userId;
        }

        public static async Task AddUserToGroup(string userId, UserGroup userGroup )
        {
            using var scope = _scopeFactory.CreateScope();

            var dbcontext = scope.ServiceProvider.GetService<ApplicationDbContext>();
            //await _applicationDbContext.UserGroups.AddAsync(userGroup, ct);
            dbcontext.UserGroupApplicationUsers.Add(
                new UserGroupApplicationUser
                {
                    UserGroup = userGroup,
                    ApplicationUserId = userId
                }
            );
            await dbcontext.SaveChangesAsync();
        } 
        
        public static async Task<List<string>> MakeSuperAdmin(int cnt)
        {
            using var scope = _scopeFactory.CreateScope();

            var userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
            var newUserIds = new List<string>();
            for (int i = 0; i < cnt; i++)
            {
                var user = new ApplicationUser {UserName = $"NUnitTestUser{i}", Email = $"user{i}@nunit.com",};
                var result = await userManager.CreateAsync(user, "Awholeneworld1!");
                
                if (result.Succeeded)
                {
                    newUserIds.Add(user.Id);
                }
                else
                {
                   throw new Exception($"Unable to create {user.Id}.{Environment.NewLine}");
                }
            }

            //var errors = string.Join(Environment.NewLine, result.ToApplicationResult().Errors);

            //throw new Exception($"Unable to create {userName}.{Environment.NewLine}{errors}");
            
            //return userId;
            return newUserIds;
        }

        public static async Task<string> RunAsUserAsync(string userName, string password)
        {
            using var scope = _scopeFactory.CreateScope();

            var userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>();

            var user = new ApplicationUser {UserName = userName, Email = userName};

            var result = await userManager.CreateAsync(user, password);


            if (result.Succeeded)
            {
                _currentUserId = user.Id;
            }

            ApplicationUser userInfo = await userManager.FindByIdAsync(_currentUserId);

            result = await userManager.UpdateAsync(userInfo);
            if (result.Succeeded)
            {
                _currentUserId = user.Id;
                return _currentUserId;

            }

            var errors = string.Join(Environment.NewLine, result.ToApplicationResult().Errors);

            throw new Exception($"Unable to create {userName}.{Environment.NewLine}{errors}");
        }

        public static async Task ResetState()
        {
            await _checkpoint.Reset(_configuration.GetConnectionString("DefaultConnection"));
            _currentUserId = null;
        }

        public static async Task<TEntity> FindAsync<TEntity>(params object[] keyValues)
            where TEntity : class
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetService<ApplicationDbContext>();

            return await context.FindAsync<TEntity>(keyValues);
        }

        public static async Task<Room> FindRoom(int roomID)
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetService<ApplicationDbContext>();

            return await context.Rooms.Include(r => r.RoomSettings).SingleAsync(r => r.Id == roomID);
        }

        public static async Task AddAsync<TEntity>(TEntity entity)
            where TEntity : class
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetService<ApplicationDbContext>();

            context.Add(entity);

            await context.SaveChangesAsync();
        }
        
        public static async Task<int> AddAsyncReturnId<TEntity>(TEntity entity)
            where TEntity : class
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetService<ApplicationDbContext>();

            context.Add(entity);

            await context.SaveChangesAsync();
            int id = (int)entity.GetType().GetProperty("Id").GetValue(entity, null);
            return id;
        }

        public static async Task<int> CountAsync<TEntity>() where TEntity : class
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetService<ApplicationDbContext>();

            return await context.Set<TEntity>().CountAsync();
        }

        public static string GetHashID(params int[] ids)
        {
            using var scope = _scopeFactory.CreateScope();

            var hasher = scope.ServiceProvider.GetService<IHashIdService>();

            var res = hasher.Encode(ids);

            return res;
        }

        public static async Task<int> PermissionBookingFixedTimeOnly()
        {
             using var scope = _scopeFactory.CreateScope();
 
             var dbcontext = scope.ServiceProvider.GetService<ApplicationDbContext>();
             var bookingOnlyPermissionSet = new PermissionSet
             {
                 Name = "BookingOnly",
                 Permissions = new List<UserPermission>
                 {
                     UserPermission.BookingMakeFixedTime,
                     UserPermission.BookingModifyCancel,
                     UserPermission.BookingMakeForMyself,
                 },
             };
             dbcontext.PermissionSet.Add(bookingOnlyPermissionSet);
 
             await dbcontext.SaveChangesAsync();
             return bookingOnlyPermissionSet.Id;
        }
        
        public static async Task<int> PermissionBookingAnyTime()
        {
             using var scope = _scopeFactory.CreateScope();
 
             var dbcontext = scope.ServiceProvider.GetService<ApplicationDbContext>();
             var bookingOnlyPermissionSet = new PermissionSet
             {
                 Name = "BookingOnly",
                 Permissions = new List<UserPermission>
                 {
                     UserPermission.BookingMakeAnyTime,
                     UserPermission.BookingModifyCancel,
                     UserPermission.BookingMakeForMyself,
                 },
             };
             dbcontext.PermissionSet.Add(bookingOnlyPermissionSet);
 
             await dbcontext.SaveChangesAsync();
             return bookingOnlyPermissionSet.Id;
        }

        private static RoomSettings SimpleRoomSettings
        {
            get
            {
                var oneSimpleRoomSettings = new RoomSettings();
                foreach (DayOfWeek suit in (DayOfWeek[]) Enum.GetValues(typeof(DayOfWeek)))
                {
                    oneSimpleRoomSettings.BookingPeriods.Add(new RoomTimeslot()
                    {
                        DayOfWeek = suit,
                        StartTime = DateTime.Today.AddHours(9),
                        EndTime = DateTime.Today.AddHours(19),
                        Interval = TimeSpan.FromHours(1),
                    });
                }
                return oneSimpleRoomSettings;
            }
        }
        
        private static Room SimpleRoom
        {
            get
            {
                var oneRoom = new Room
                {
                    Name = "Test",
                    MappingKey = "MappingKey",
                    RoomSettings = SimpleRoomSettings
                };
                return oneRoom;
            }
        }
        private static RoomSet SimpleRoomSet
        {
            get
            {
                var roomSet = new RoomSet()
                {
                    Name = "RoomSet test",
                    AllRooms = false,
                    SoftwareSystem = true,
                    Rooms = new List<Room>
                    {
                        _presetRooms[0],
                    }
                };
                return roomSet;
            }
        }
        private static UserRole SimpleUserRole
        {
            get
            {
                var permSet = new PermissionSet
                    { Permissions = { UserPermission.BookingMakeFixedTime, UserPermission.BookingMakeForMyself,UserPermission.BookingViewMyBooking } };
                var userRole = new UserRole()
                {
                    Name = "UserRole test",
                    PermissionSet = permSet,
                };
                return userRole;
            }
        }
        
        private static UserRole SimpleUserRoleWithCustomTimeRange
        {
            get
            {
                var permSet = new PermissionSet
                    { Permissions = { UserPermission.BookingMakeAnyTime , UserPermission.BookingMakeFixedTime, UserPermission.BookingMakeForMyself,UserPermission.BookingViewMyBooking } };
                var userRole = new UserRole()
                {
                    Name = "UserRole Custom Range test",
                    PermissionSet = permSet,
                };
                return userRole;
            }
        }

        public static async Task AddMeToSimpleUserGroup(string userId)
        {
             using var scope = _scopeFactory.CreateScope();
             var dbcontext = scope.ServiceProvider.GetService<ApplicationDbContext>();
             var userRole = SimpleUserRole;
             var roomSetId = _roomSetIds.First();
             userRole.RoomSetId = _roomSetIds.First();
             userRole.RoomSet = dbcontext.RoomSets.Single(i => i.Id == roomSetId);
             
             var userGroup = new UserGroup()
             {
                 UserRoles = new List<UserRole>() { userRole },
             };
             var onePair = new UserGroupApplicationUser()
             {
                 ApplicationUserId = userId,
                 UserGroup = userGroup,
             };
             dbcontext.UserGroupApplicationUsers.Add(onePair);
             await dbcontext.SaveChangesAsync();
        }
        
        public static async Task AddMeToSimpleAdminGroup(string userId)
        {
             using var scope = _scopeFactory.CreateScope();
             var dbcontext = scope.ServiceProvider.GetService<ApplicationDbContext>();
             var userRole = SimpleUserRoleWithCustomTimeRange;
             var roomSetId = _roomSetIds.First();
             userRole.RoomSetId = _roomSetIds.First();
             userRole.RoomSet = dbcontext.RoomSets.Single(i => i.Id == roomSetId);
             
             var userGroup = new UserGroup()
             {
                 UserRoles = new List<UserRole>() { userRole },
             };
             var onePair = new UserGroupApplicationUser()
             {
                 ApplicationUserId = userId,
                 UserGroup = userGroup,
             };
             dbcontext.UserGroupApplicationUsers.Add(onePair);
             await dbcontext.SaveChangesAsync();
        }

        public static async Task MakeRooms(int n)
        {
            using var scope = _scopeFactory.CreateScope();

            var dbcontext = scope.ServiceProvider.GetService<ApplicationDbContext>();

            int    id        = 1;
            string rmName    = "Room ";
            string rmChiName = "Room CHi";

            var testRooms = new Faker<Room>()
                           .CustomInstantiator(f => new Room())
                           .RuleFor(r => r.Name,        f => rmName    + id)
                           .RuleFor(r => r.ChineseName, f => rmChiName + id)
                           .RuleFor(r => r.MappingKey,  f => rmChiName + id++);
            var room = new RoomSettings
            {
                BookingPeriods = MakeBookingTimeSlot(),
            };
            var rmList = testRooms.Generate(n);

            for (int i = 0; i < n; i++)
            {
                rmList[i].RoomSettings = MakeRoomSettings();

                dbcontext.Add(rmList[i]);
            }

            await dbcontext.SaveChangesAsync();
            _presetRoomsIds.AddRange(rmList.Select(i => i.Id));
            _presetRooms.AddRange(rmList);
        }

        public static RoomSettings MakeRoomSettings()
        {
            var roomSettings = new RoomSettings
            {
                BookingPeriods = MakeBookingTimeSlot(),
            };
            return roomSettings;
        }

        public static List<RoomTimeslot> MakeBookingTimeSlot()
        {
            int n = 7;

            var BookingPeriods = new List<RoomTimeslot>(n);
            for (int i = 0; i < n; i++)
            {
                BookingPeriods.Add(
                                   new RoomTimeslot
                                   {
                                       Interval  = TimeSpan.FromHours(1),
                                       StartTime = DateTime.Today + TimeSpan.FromHours(4),
                                       EndTime   = DateTime.Today + TimeSpan.FromHours(14),
                                       DayOfWeek = (DayOfWeek) i,
                                   }
                                  );
            }

            return BookingPeriods;
        }

        public static Domain.Entities.UserRole MakeUserRole()
        {
            var userRole = new Domain.Entities.UserRole()
            {
            };
            return userRole;
        }

        public static async Task<int> MakeRoomSet(int n, IEnumerable<int> rmIds)
        {
            using IServiceScope scope = _scopeFactory.CreateScope();

            ApplicationDbContext dbcontext = scope.ServiceProvider.GetService<ApplicationDbContext>();

            List<Room> rmlist = new();
            foreach (var x in rmIds)
            {
                rmlist.Add(dbcontext.Rooms.Single(r => r.Id == x));
            }

            RoomSet roomSet = new()
            {
                Name     = "Room Set " + n,
                AllRooms = false,
                Rooms    = new List<Room>(),
            };

            roomSet.Rooms = rmlist;

            dbcontext.RoomSets.Add(roomSet);
            await dbcontext.SaveChangesAsync();
            _roomSetIds.Add(roomSet.Id);
            return roomSet.Id;
        }

        [OneTimeTearDown]
        public void RunAfterAnyTests()
        {
        }
    }
}