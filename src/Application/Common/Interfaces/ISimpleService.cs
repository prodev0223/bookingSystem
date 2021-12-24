namespace booking.Application.Common.Interfaces
{
    public interface ISimpleService
    {
        string Name { get; }
        
        int Value { get; set; }

        public void AddOne();
    }
}