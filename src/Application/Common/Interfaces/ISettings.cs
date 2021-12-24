namespace booking.Application.Common.Interfaces
{
    public interface ISettings<T> where T : ISettings<T>, new()
    {
        T WithDefaultValues();
    }
}