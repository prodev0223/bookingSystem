using Microsoft.CodeAnalysis;

namespace CodeGenerator.Attributes
{
    public class MediatrInject2
    {
        public INamedTypeSymbol MediatrInject { get; }

        public MediatrInject2(INamedTypeSymbol mediatrInject)
        {
            MediatrInject = mediatrInject;
        }
    }
}