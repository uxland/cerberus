using Cerberus.Core.MartenPersistence.Repositories;
using Cerberus.Maintenance.Features.Features.Analysis.Filters;
using Marten;
using Marten.Schema;

namespace Cerberus.Maintenance.Persistence.Seeding;

public class ScriptsInitialData: IInitialData
{
    
    public async Task Populate(IDocumentStore store, CancellationToken cancellation)
    {
        await using var session = store.LightweightSession();
        await this.InitializeFilter(CreateBlurryFilter(), session);
        await this.InitializeFilter(CreateNoBlobsFilter(), session);
        await session.SaveChangesAsync(cancellation);
    }
    
    private async Task InitializeFilter(CreateFilter command, IDocumentSession session)
    {
        var state = await session.Events.FetchStreamStateAsync(command.Id);
        if (state == null)
            Handler.Handle(command, new GenericEventSourcingRepository(session));
    }
    
    private static CreateFilter CreateBlurryFilter()
    {
        const string id = "maintenance-blurry-detection-script";
        const string description = "Blurry image detection";
        const string script = @"
import cv2
import ctypes
import numpy as np

def process_image(byte_array):

    # Convertim el bytearray a un buffer de tipus c_char
    buffer = (ctypes.c_char * len(byte_array)).from_buffer(byte_array)
    
    # Decodifiquem la imatge utilitzant OpenCV
    img_np = cv2.imdecode(np.frombuffer(buffer, np.uint8), cv2.IMREAD_GRAYSCALE)
    
    # Calculem la variança del filtre Laplacian
    laplacian_var = cv2.Laplacian(img_np, cv2.CV_64F).var()
    
    # Defineix un llindar per determinar si la imatge és borrosa
    threshold = 100  # Pots ajustar aquest valor segons les teves necessitats
    
    # Comprovem si la variança és inferior al llindar
    if laplacian_var < threshold:
        return False  # Imatge borrosa
    else:
        return True  # Imatge nítida

";
        return new CreateFilter(id, description, script);
    }
    
    private static CreateFilter CreateNoBlobsFilter()
    {
        const string id = "maintenance-no-blobs-detection-script";
        const string description = "No blobs detection";
        const string script = @"
import cv2
import ctypes
import numpy as np

def process_image(byte_array):
    # Convertim el bytearray a un buffer de tipus c_char
    buffer = (ctypes.c_char * len(byte_array)).from_buffer(byte_array)
    
    # Decodifiquem la imatge utilitzant OpenCV
    img_np = cv2.imdecode(np.frombuffer(buffer, np.uint8), cv2.IMREAD_GRAYSCALE)
    
    # Aplicar binarització (exemple: umbral 128)
    _, binary_result = cv2.threshold(img_np, 128, 255, cv2.THRESH_BINARY)
    
    # Cerca de blobs (exemple: utilitzant SimpleBlobDetector)
    params = cv2.SimpleBlobDetector_Params()
    detector = cv2.SimpleBlobDetector_create(params)
    keypoints = detector.detect(binary_result)
    
    # Si hi ha blobs, retornem ""ok"", sinó ""no ok""
    if len(keypoints) > 0:
        return True
    else:
        return False
";
        return new CreateFilter(id, description, script);
    }
}