namespace booking.Domain.Enums
{
    public enum UserPermission
    {
        AllPermission                     = 1,
        BookingViewOnly                   = 2,
        BookingMakeForMyself              = 3,
        BookingMakeAnyTime                = 4,
        BookingMakeFixedTime              = 5,
        BookingMakeAsOtherUserGroup       = 6,
        BookingModifyCancel               = 7,
        BookingMakeAsOtherUser            = 8,
        BookingApprovalPending            = 9,
        BookingModifyCancelViewRegional   = 10,
        BookingModifyCancelViewAll        = 11,
        BookingViewEquipment              = 12,
        BookingViewAnyBooking             = 13,
        BookingViewMyBooking              = 14,

        BookingExtraItem       = 100,
        FacilityManagement     = 110,
        AccountManagement      = 130,
        SmtpSetting            = 190,
        ReportsAllUnit         = 1000,
        ReportsOwnUnit         = 2000,
    }
}