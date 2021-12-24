using System;
using System.Collections.Generic;
using Bogus;
using booking.Domain.Entities;
using booking.Domain.Enums;
using FluentValidation.AspNetCore;

namespace booking.Application.IntegrationTests
{
    public static class TestingSeedData
    {
        private static int roomIdCounter = 1;
        public static List<RoomTimeslot> SameOpeningHourForAll7Days(DateTime start, DateTime end, TimeSpan timeSpan)
        {
            var bookingPeriods = new List<RoomTimeslot>(7);
            for (var i = 0; i < 7; i++)
            {
                bookingPeriods.Add(
                    new RoomTimeslot
                    {
                        Interval = timeSpan,
                        StartTime = start,
                        EndTime = end,
                        DayOfWeek = (DayOfWeek)i
                    }
                );
            }

            return bookingPeriods;
        }

        public static RoomSettings MakeSimpleRoomSettings()
        {
            var roomSettings = new RoomSettings
            {
                BookingPeriods = SameOpeningHourForAll7Days(DateTime.Today.AddHours(9), DateTime.Today.AddHours(19),
                    TimeSpan.FromHours(1))
            };
            return roomSettings;
        }

        private static List<Room> AddRooms(string roomName, int count)
        {
            var testRooms = new Faker<Room>()
                .CustomInstantiator(f => new Room())
                .RuleFor(r => r.Name, () => roomName + roomIdCounter)
                .RuleFor(r => r.ChineseName, () => roomName + roomIdCounter + "(Chi)")
                .RuleFor(r => r.MappingKey, () => roomName + roomIdCounter++ + "(mapping)")
                .RuleFor(r => r.RoomSettings, MakeSimpleRoomSettings);
            var res = testRooms.Generate(count);
            return res;
        }

        public static RoomSet AddRoomSets(string roomSetName)
        {
            const int id = 1;
            const int roomCount = 10;
            var testRooms = new Faker<RoomSet>()
                .CustomInstantiator(f => new RoomSet())
                .RuleFor(r => r.Name, () => roomSetName)
                .RuleFor(r => r.Rooms, () => AddRooms(roomSetName, roomCount));
            var res = testRooms.Generate();
            return res;
        }

        public static PermissionSet AddSimpleFixedTimeBookingPermissionSet()
        {
            var res = new PermissionSet()
            {
                Name = "Simple Make Fixed Time Booking",
                Permissions = new List<UserPermission>()
                {
                    UserPermission.BookingMakeForMyself,
                    UserPermission.BookingMakeFixedTime,
                    UserPermission.BookingModifyCancel,
                    UserPermission.BookingViewMyBooking
                }
            };
            return res;
        }

        public static PermissionSet AddSimpleFreeTimeBookingPermissionSet()
        {
            var res = new PermissionSet()
            {
                Name = "Simple Make Free Time Booking",
                Permissions = new List<UserPermission>()
                {
                    UserPermission.BookingMakeAnyTime,
                    UserPermission.BookingMakeForMyself,
                    UserPermission.BookingMakeFixedTime,
                    UserPermission.BookingModifyCancel,
                    UserPermission.BookingViewMyBooking
                }
            };
            return res;
        }

        public static UserRole ViewBooking()
        {
            var viewMyBooking = new UserRole()
            {
                PermissionSet = new PermissionSet()
                {
                    Name = "ViewMyBooking", Permissions = new List<UserPermission>()
                    {
                        UserPermission.BookingViewMyBooking,
                    }
                },
                RoomSet = new RoomSet
                {
                    Name = "System",
                    SoftwareSystem = true
                }
            };
            return viewMyBooking;
        }
        
        public static UserRole EmptyRole()
        {
            var viewMyBooking = new UserRole()
            {
                PermissionSet = new PermissionSet()
                {
                    Name = "ViewMyBooking", Permissions = new List<UserPermission>()
                    {
                    }
                },
                RoomSet = new RoomSet
                {
                    Name = "Empty",
                    SoftwareSystem = true
                }
            };
            return viewMyBooking;
        }

        public static UserGroup SimpleFixedBookingTimeUserGroup()
        {
            var userRole = new UserRole();
            userRole.PermissionSet = AddSimpleFixedTimeBookingPermissionSet();
            userRole.RoomSet = AddRoomSets("TestingDataSeedRoomSet");
            var res = new UserGroup();
            res.Name = nameof(SimpleFixedBookingTimeUserGroup);
            res.UserRoles = new List<UserRole> { EmptyRole(), userRole, ViewBooking() };
            return res;
        }

        public static UserGroup SimpleFreeBookingTimeUserGroup(string userId)
        {
            var userRole = new UserRole();
            userRole.PermissionSet = AddSimpleFreeTimeBookingPermissionSet();
            userRole.RoomSet = AddRoomSets("TestingDataSeedRoomSet");
            var res = new UserGroup();
            res.Name = nameof(SimpleFreeBookingTimeUserGroup);
            res.UserRoles = new List<UserRole> { EmptyRole(), userRole, ViewBooking() };
            return res;
        }
    }
}