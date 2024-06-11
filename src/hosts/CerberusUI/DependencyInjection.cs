﻿using Blazorise;
using Blazorise.Bootstrap;
using Blazorise.Icons.FontAwesome;
using Cerberus.UI.Components.Layout;
using Cerberus.UI.Infrastructure;
using Cerberus.UI.Infrastructure.Maintenance;

namespace Cerberus.UI;

public static class DependencyInjection
{
    public static IServiceCollection UseCerberusUi(this IServiceCollection services)
    {
        return services
            .UseBlazorise()
            .AddSingleton<ApiClient>()
            .AddSingleton<TreeItemsLoader>()
            .AddSingleton<CaptureClient>()
            .AddSingleton<CameraDetailGetter>()
            .AddSingleton<LocationDetailGetter>()
            .AddSingleton<CameraThumbnailsGetter>()
            .AddSingleton<LocationStructureUploader>()
            .AddSingleton<LocationStructureNotificationsService>()
            .AddSingleton<CameraCapturesGetter>()
            .BootstrapMaintenance();
    }
    
    private static IServiceCollection UseBlazorise(this IServiceCollection services)
    {
        return services
            .AddBlazorise(options =>
            {
                options.Immediate = true;
                options.ProductToken = "CjxRBHF7NAw8VQNzejc1BlEAc3o1Dj1XAHV9Nwo6bjoNJ2ZdYhBVCCo/CTRaCExERldhE1EvN0xcNm46FD1gSkUHCkxESVFvBl4yK1FBfAYKFTxsWWBuOh4RQXlYIncTB0FnUy5xGRFaakM0Yx4RP3ZDPHwIA0xsX246HhFEbVgscw4DVXRJN3UeEUh5VDxvEwFSa1M8Cg8BWnRFLnkVHQgyUzxzCQ9XbF88bwwPXWdTMX8WHVpnNi1/HgJMdUU3Y0xEWmdAKmMVGEx9WzxvDA9dZ1MxfxYdWmc2LX8eAkx1RTdjTERaZ1gxdQQYTH1bPG8MD11nUzF/Fh1aZzYtfx4CTHVFN2NMREhSdFEfNhZCdz0zQBsLYHNYUgkCdmNZPAJSNX49f10xfHAKXGxDSB8oeVNCfgtDLCNpbU5MfwZ5TUxDWnM7JTBWZjN7KTtOekVMaBYEd3lJGwIQfVVyYzlycitDUCcESSwJQFtiGwh5AXVKeTdAFSpsXD9aSDhhfwp0V3EAfEt/bRtfNwpND0YweXY6Rm9lD0kvK2RqXC9cEgBRSW4aV3h7KktdCl8GLz1/f14=";
            })
            .AddBootstrapProviders()
            .AddFontAwesomeIcons();
    }
    
}