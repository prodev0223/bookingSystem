using booking.Application.Common.Interfaces;
using booking.Application.Common.Validator;
using FluentValidation;

namespace booking.Application.WeatherForecasts.Queries.GetWeatherForecasts
{
    public class GetWeatherForecastsQueryValidator : AbstractValidator<GetWeatherForecastsQuery>
    {
        private ICurrentUserService _currentUserService;
        private IIdentityService _identityService;
        private IApplicationDbContext _applicationDbContext;
        
        

        public GetWeatherForecastsQueryValidator(ICurrentUserService currentUserService, IIdentityService identityService, IApplicationDbContext applicationDbContext) 
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