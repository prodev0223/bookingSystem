using Hangfire.Dashboard;

namespace booking.WebUI.Filters
{
    public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
    {
        //TODO Make a real Authorization 
        private readonly string[] _roles;

        public HangfireAuthorizationFilter(params string[] roles)
        {
            _roles = roles;
        }

        public bool Authorize(DashboardContext context)
        {
            var httpContext = ((AspNetCoreDashboardContext)context).HttpContext;

            //Your authorization logic goes here.

            return true; //I'am returning true for simplicity
        }
    }
}
