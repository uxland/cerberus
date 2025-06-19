using System.Reflection;
using QuestPDF.Infrastructure;
using QuestPDF.Drawing;

namespace Cerberus.Surveillance.Features.Features.Run.Export;

public static class FontConfiguration
{
    private static bool _fontsRegistered = false;
    private static readonly object _lock = new object();

    public static void RegisterFonts()
    {
        if (_fontsRegistered) return;

        lock (_lock)
        {
            if (_fontsRegistered) return;

            try
            {
                var assembly = Assembly.GetExecutingAssembly();
                var baseNamespace = "Cerberus.Surveillance.Features.Features.Run.Export.Fonts.Heebo.static";

                // Registrar Heebo Regular
                RegisterFont(assembly, $"{baseNamespace}.Heebo-Regular.ttf");
                
                // Registrar Heebo Bold
                RegisterFont(assembly, $"{baseNamespace}.Heebo-Bold.ttf");
                
                // Registrar Heebo Medium
                RegisterFont(assembly, $"{baseNamespace}.Heebo-Medium.ttf");

                _fontsRegistered = true;
            }
            catch (Exception ex)
            {
                // Fallback silencioso a fuentes del sistema
                Console.WriteLine($"Warning: Could not load Heebo fonts: {ex.Message}");
            }
        }
    }

    private static void RegisterFont(Assembly assembly, string resourceName)
    {
        using var stream = assembly.GetManifestResourceStream(resourceName);
        if (stream != null)
        {
            try
            {
                FontManager.RegisterFont(stream);
                Console.WriteLine($"Successfully registered font: {resourceName}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to register font {resourceName}: {ex.Message}");
            }
        }
        else
        {
            Console.WriteLine($"Warning: Font resource not found: {resourceName}");
        }
    }
}
