using System;
using System.Collections.Generic;
using System.Linq;
using CodeGenerator.ValidationTemplate;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace CodeGenerator
{
   // [Generator]
    public class BookingIdValidation:ISourceGenerator
    {
        public void Initialize(GeneratorInitializationContext context)
        {
            #if DEBUG
            //System.Diagnostics.Debugger.Launch();
            //
            //SpinWait.SpinUntil(() => Debugger.IsAttached);
            #endif
        }

        public void Execute(GeneratorExecutionContext context)
        {
            var syntaxTrees = context.Compilation.SyntaxTrees;
            foreach (var syntaxTree  in syntaxTrees)
            {
                var root = syntaxTree.GetCompilationUnitRoot();
                var needValidate = syntaxTree
                    .GetRoot().DescendantNodes().OfType<TypeDeclarationSyntax>()
                    .Where(x => x.AttributeLists.Any(xx => xx.ToString().StartsWith("[AutoGenerateValidation"))).ToList();

                var spaceTemp = syntaxTree
                    .GetRoot().DescendantNodes().OfType<NamespaceDeclarationSyntax>();
                var space = "nospace";
                if (spaceTemp?.Count() > 0)
                {
                    
                    space = spaceTemp.First().Name.ToString();
                }
                    
                    
                
                //var name2 = tarnamespacestr.First().Name.ToString();
                var name2 = Environment.NewLine+"ss";
                foreach (var needV in needValidate)
                {
                    bool haveAge = false;
                    var ages = new List<string>();
                    var needVClassMemberList = needV.Members;
                    foreach (var member in needVClassMemberList)
                    {
                        if (member is PropertyDeclarationSyntax p)
                        {
                            if (p.Identifier.Text.Contains("BookingId"))
                            {
                                ages.Add(p.Identifier.Text);
                            }
                        }
                    }
                    
                    var lists = needV.AttributeLists.ToString();
                    var sss= string.Join(Environment.NewLine, needV.AttributeLists.Select(i => i.ToString())) + Environment.NewLine;
                    var className = needV.Identifier.ToString();
                    context.AddSource($"{className}_BookingIdExistValidation.g.cs", BookingIdValidationBody.BookingIdBody(className, space));
                }
            }
        }
    }
}