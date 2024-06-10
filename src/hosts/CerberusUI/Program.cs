using Cerberus.Maintenance.Features.Features.MaintenanceChecks;
using Cerberus.UI;
using Cerberus.UI.Components;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.FileProviders;
using Wolverine;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseWolverine(opts =>
{
    opts.Durability.Mode = DurabilityMode.Solo;
    opts.ApplicationAssembly = typeof(Program).Assembly;
    opts.Discovery.IgnoreAssembly(typeof(MaintenanceCheck).Assembly);
});

builder.Services.AddDataProtection()
    .SetApplicationName("CerberusUI")
    .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(builder.Environment.ContentRootPath, "keys")));

builder.Services.AddHttpClient()
   .UseCerberusUi();
// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents()
    .AddHubOptions(options => options.DisableImplicitFromServicesParameters = true);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

var di = new DirectoryInfo(builder.Configuration.GetSection("SnaphotCaptures:FolderRoot").Value!);
if (!di.Exists)
    di.Create();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
            di.FullName
        ),
    RequestPath = "/images"
});

//app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();