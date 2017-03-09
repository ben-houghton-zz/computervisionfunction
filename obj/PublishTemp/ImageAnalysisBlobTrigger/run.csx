#r "Microsoft.WindowsAzure.Storage" 


using System;
using Microsoft.WindowsAzure.Storage.Blob;

public static void Run(CloudBlockBlob myBlob, string name, TraceWriter log, out string outputQueueItem)
{
    log.Info($"C# Blob trigger function Processed blob\n Name:{name} \n Path: {myBlob.Uri} \n Size:{myBlob.Properties.Length} ");

    if (myBlob.Properties.Length < 4000000)
    {
        outputQueueItem = myBlob.Uri.AbsoluteUri;
    }
    else
    {
        log.Info($"Blob Name:{name} Path: {myBlob.Uri} is greater than 4MB Size:{myBlob.Properties.Length}. Too large to process");
        outputQueueItem = null;
    }
}