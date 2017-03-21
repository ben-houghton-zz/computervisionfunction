# Image Analysis Function Using Azure Cognitive Services - C<span>#</span>

This [Azure Function](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview) will process images uploaded to an Azure Storage Blob container using the 
[Azure Cognitive Services Computer Vision](https://www.microsoft.com/cognitive-services/en-us/computer-vision-api). 

The Computer Vision API provides state-of-the-art algorithms to process images and return information. For example, it can be used to determine if an image contains mature 
content, or it can be used to find all the faces in an image. It also has other features like estimating dominant and accent colors, categorizing the content of images, 
and describing an image with complete English sentences. Additionally, it can also intelligently generate images thumbnails for displaying large images effectively.


## What you'll need

- An [Azure Subscription](https://azure.microsoft.com/en-gb/free/?&WT.srch=1&WT.mc_ID=SEM_Bing_UKAzureBG_)
- An [Azure Function App](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview)
- An [Azure DocumentDB](https://azure.microsoft.com/en-us/services/documentdb/) instance
- An [Azure Storage Account](https://azure.microsoft.com/en-gb/services/storage/)

## How it works

When the an image is uploaded to the Azure Storage Account blob container (You can use [Azure Storage Explorer](http://storageexplorer.com/) for this) a `BlobTrigger` event is generated and the ImageAnalysisBlobTrigger puts the blob URL on an Azure Storage Queue.

Adding a message containing the image blob URL to the queue generates a `QueueTrigger` event which activates the ImageAnalysisQueueTrigger Function. This Function retrieves the message containing the image blob URL and posts this to the 
[Azure Cognitive Services Computer Vision](https://www.microsoft.com/cognitive-services/en-us/computer-vision-api) API. The API performs images analysis and returns a JSON payload of data.

When the data is succesfully returned from the Computer Vision API, the JSON document is written to an [Azure DocumentDB](https://azure.microsoft.com/en-us/services/documentdb/) where we could perform queries or analytics against the data.

Next the image is analysed for any text using the Computer Vision OCR service, any data that is returned is then used to update the DocumentDB document.

Because this data is written to a DocumentDB database, it can be integrated with [Azure Search](https://docs.microsoft.com/en-us/azure/search/search-howto-index-documentdb) which then gives you a searchable respository for 
all the tags and meta data returned from the Computer Vision API.

To make this demo work, you need to clone or download this repository, then - 

### Edit the appsettings.json file with your own values

```javascript
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "DefaultEndpointsProtocol=https;AccountName=[StorageAccountName];AccountKey=[Storage Account Key];",
    "AzureWebJobsDashboard": "DefaultEndpointsProtocol=https;AccountName=[StorageAccountName];AccountKey=[Storage Account Key];",
    "DocumentDBConnection": "AccountEndpoint=[Document DB EndPoint];AccountKey=[Document DB Account Key];"
	"SubscriptionKey": "[Your Cognitive Services Computer Vision Key]"
  }
}
```

### Upload the Functions code to you Azure Function App Environment
- You can do this in Visual Studio by right clicking on the project name and selecting 'Deploy'.
- You can use [Continuous Integration](https://docs.microsoft.com/en-us/azure/azure-functions/functions-continuous-deployment)
- Cut and paste this code into [a Function you created in the Azure Portal](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function-azure-portal)



## Learn more about developing [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference)

