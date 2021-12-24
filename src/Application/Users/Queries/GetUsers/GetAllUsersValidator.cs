using booking.Application.Common.Interfaces;
using booking.Application.Common.Validator;
using booking.Application.WeatherForecasts.Queries.GetWeatherForecasts;
using FluentValidation;

namespace booking.Application.Users.Queries.GetUsers
{
    public class GetAllUsersValidator : AbstractValidator<GetAllUsers>
    {
        public GetAllUsersValidator()
        {
            /*
            _casbinAuthor = casbinAuthor;

            _currentUserService = currentUserService;
            //var res = _casbinAuthor.Check(_currentUserService.UserId, "R1", "P1");
            RuleFor(x => x.City)
               
               .NotEmpty()
               .MinimumLength(10).WithMessage("City longer Name");
            */
        }
    }
}