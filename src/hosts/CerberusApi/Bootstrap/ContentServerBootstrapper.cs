using Microsoft.Extensions.FileProviders;

namespace Cerberus.Api.Bootstrap;

public static class ContentServerBootstrapper
{
    public static IApplicationBuilder BootstrapContentServer(this IApplicationBuilder app, WebApplicationBuilder builder)
    {
        var di = new DirectoryInfo(builder.Configuration.GetSection("SnaphotCaptures:FolderRoot").Value!);
        if (!di.Exists)
            di.Create();
        return app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(
                di.FullName
            ),
            RequestPath = "/images"
        })
        .UseStaticFiles();
    }
}