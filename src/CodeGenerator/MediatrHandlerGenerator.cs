using System;
using System.Collections.Generic;
using System.Linq;
using booking.Domain.Enums;
using CodeGenerator.ValidationTemplate;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace CodeGenerator
{
    [Generator]
    public class MediatrHandlerGenerator:ISourceGenerator
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
                    .Where(x => x.AttributeLists.Any(xx => xx.ToString().StartsWith($"[MediatrInject("))).ToList();

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
                    bool haveAge = false;
                    
                    string rawMediatrServiceType = "";
                    foreach (var v in needV.AttributeLists)
                    {
                        if (v.ToString().Contains(nameof(MediatrServiceType)))
                        {
                            rawMediatrServiceType = v.Attributes.First().ArgumentList.Arguments.ToString();
                        }
                    }
                    var className = needV.Identifier.ToString();
                    string responseTypeStr = ""; 
                    
                    var irequestthings = needV.BaseList.ChildNodes();
                    foreach (var VARIABLE in irequestthings)
                    {
                        string vaa = VARIABLE.ToString();
                        if (vaa.StartsWith("IRequest"))
                        {
                            responseTypeStr = vaa.Substring(9, vaa.Length - 10);
                        }
                    }
                    context.AddSource( $"{className}_partialHandler.cs", MediatorHandlerBody.MediatorHandlerIdBody(usingDirectivesStr, className, space, responseTypeStr, rawMediatrServiceType));
                }
            }
        }
    }
}