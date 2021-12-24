using System;
using System.Collections.Generic;
using System.Linq;

namespace CodeGenerator.ValidationTemplate
{
    public static class AgeTestValidationBody
    {
        public static string BookingIdBody(string ClassName, string namespacestr, string extra, IList<string> ages = null)
        {
            string ageList = "";
            if (ages is not null)
            {
                ageList +=
                    string.Join("",
                        ages.Select(a => $"RuleFor(i => i.{a}).Must(x => x <= 100 && x >= 0);{Environment.NewLine}"));
            }
            return 
         $@"//FooBarBody
/*
{extra}
*/
using System;
using FluentValidation;

namespace {namespacestr}
{{
//aaaaa
    public  class {ClassName}ValidatorAutoGen : AbstractValidator<{ClassName}>
    {{

        public {ClassName}ValidatorAutoGen()
        {{
            {ageList}
        }}
    }}
}}
";}    }
}