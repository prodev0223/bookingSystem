using System;
using System.Linq;
using booking.Domain.Enums;

namespace CodeGenerator.ValidationTemplate
{
    public static class MediatorHandlerBody
    {
        public static (string interfaceStr, string propStr) Property(string s, string loggerClass = "")
        {
            string part2 = s.Split(new[] { '.' })[1];
            string part2lowerhead = Char.ToLower(part2[0]) + part2.Substring(1);
            switch (s)
            {
                case nameof(MediatrServiceType) + "." + nameof(MediatrServiceType.Logger):
                    return ($"ILogger<{loggerClass}>", "logger");

                default:
                    return ($"I{part2}", part2lowerhead);
            }
        }
        
        //public MediatrServiceType;
        // mediatrServiceTypes is like:    MediatrServiceType.Identity, MediatrServiceType.Identity
        public static string MediatorHandlerIdBody(string usingStr, string ClassName, string namespacestr, string responseType,  string mediatrServiceTypes)
        {
            string classProperties = "";
            string args = "";
            string constructors = "";

            foreach (var m in mediatrServiceTypes.Split(new char[]{','}))
            {
                var x = Property(m.Trim(), ClassName  );
                classProperties += $"private readonly {x.interfaceStr } _{x.propStr};{Environment.NewLine}";
                args += $"{Environment.NewLine}{x.interfaceStr} {x.propStr},";
                constructors  += $"_{x.propStr} = {x.propStr};{Environment.NewLine}";
            }
            
            return $@"//Generate Dependence Injection
using booking.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;
using AutoMapper;
using booking.Application.Common.BookingChecker;
{usingStr}

namespace {namespacestr}
{{
    public partial class {ClassName}Handler :IRequestHandler<{ClassName}, {responseType}>
    {{
        {classProperties}
        public {ClassName}Handler({args.Substring(0, args.Length - 1)})
        {{
            {constructors}
        }}
    }}
}}";
        }
    }
}
