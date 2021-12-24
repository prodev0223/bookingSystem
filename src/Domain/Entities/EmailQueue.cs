namespace booking.Domain.Entities
{
    public class EmailQueue
    {
        public int Id { get; set; }
        public EmailTemplate EmailTemplate { get; set; }
        public string TemplateFields { get; set; } = "";
    }
}