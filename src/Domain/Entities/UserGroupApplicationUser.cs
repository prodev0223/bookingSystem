namespace booking.Domain.Entities
{
    public class UserGroupApplicationUser
    {
        public string ApplicationUserId { get; set; }

        public UserGroup UserGroup { get; set; }
        
        public int UserGroupId { get; set; }
    }
}