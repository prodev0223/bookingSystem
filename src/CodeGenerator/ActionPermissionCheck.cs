using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using booking.Domain.Enums;
using CodeGenerator.ValidationTemplate;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace CodeGenerator
{
    [Generator]
    public class ActionPermissionCheck:ISourceGenerator
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
                    .Where(x => x.AttributeLists.Any(xx => xx.ToString().StartsWith($"[Permission"))).ToList();
                if (needValidate?.Count == 0)
                {
                    continue;
                }

                var spaceTemp = syntaxTree
                    .GetRoot().DescendantNodes().OfType<NamespaceDeclarationSyntax>();
                var space = "nospace";

                var usingDirectives = syntaxTree
                    .GetRoot()
                    .DescendantNodes()
                    .OfType<UsingDirectiveSyntax>();
                var usingDirectivesStr = string.Join(Environment.NewLine, usingDirectives); 
                
                if (spaceTemp?.Count() > 0)
                {
                    space = spaceTemp.First().Name.ToString();
                }
                
                foreach (var needV in needValidate)
                {
                    
                    bool haveBookingID = false;
                    bool haveRoom = false;
                    var ages = new List<(string field, string db)>();
                    var needVClassMemberList = needV.Members;
                    foreach (var member in needVClassMemberList)
                    {
                        if (member is PropertyDeclarationSyntax p)
                        {
                            if (p.Identifier.Text ==  "BookingId")
                            {
                                haveBookingID = true;
                            }
                            if (p.Identifier.Text ==  "RoomId")
                            {
                                haveRoom = true;
                            }

                            if (p.AttributeLists.ToString().Contains("[Unique("))
                            {
                                var t = p.AttributeLists[0].Attributes.First().ArgumentList.Arguments.ToString();
                                t = t.Substring(1, t.Length - 2);
                                ages.Add((p.Identifier.Text, t));
                            }
                        }
                    }

                    string rawPermissionList = "";
                    foreach (var v in needV.AttributeLists)
                    {
                        if (v.ToString().Contains("UserPermission"))
                        {
                            rawPermissionList = v.Attributes.First().ArgumentList.Arguments.ToString();
                        }
                    }
                    var className = needV.Identifier.ToString();
                    
                    context.AddSource( $"{className}_PermissionAutoGen.cs", ActionPermissionTemplate.Body(usingDirectivesStr, className, space, rawPermissionList, haveRoom, haveBookingID, ages));
                }
            }
        }
    }
}