namespace booking.Domain.Entities
{
    public class EmailTemplate
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Body { get; set; } = "";
    }
}