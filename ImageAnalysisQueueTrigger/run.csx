using System;
using System.Web;
using System.Text;
using System.Configuration;

public static void Run(string myQueueItem, out object outputDocument, TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem}");

    string outPut = AnalyseImage(myQueueItem, log);

    log.Info($"Computer Vision Response : {outPut}");

    outputDocument = outPut;
}

/// <summary>
/// Make a POST request to the ComputerVision API send the URL to the image in the blob container
/// </summary>
/// <param name="blobUrl"></param>
/// <param name="log"></param>
/// <returns></returns>
private static string AnalyseImage(string blobUrl, TraceWriter log)
{
    var requestBody = "{\"url\":\"" + blobUrl + "\"}";

    log.Info($"Request body: {requestBody}");

    var queryString = "visualFeatures=Categories,Tags,Description,Faces,ImageType,Color,Adult&language=en";

    var uri = "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + queryString;

    log.Info($"Calling Uri: {uri}");

    string response = HttpPost(uri, requestBody, log);

    return response;
}


/// <summary>
/// Make a simple HTTP Post
/// </summary>
/// <param name="URI"></param>
/// <param name="body"></param>
/// <param name="log"></param>
/// <returns></returns>
public static string HttpPost(string URI, string body, TraceWriter log)
{

    var subscriptionKey = System.Environment.GetEnvironmentVariable("SubscriptionKey", EnvironmentVariableTarget.Process);

    System.Net.WebRequest req = System.Net.WebRequest.Create(URI);
    req.Method = "POST";
    req.Headers.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
    byte[] bytes = System.Text.Encoding.ASCII.GetBytes(body);

    log.Info($"Posting data");

    req.ContentLength = bytes.Length;
    System.IO.Stream os = req.GetRequestStream();
    os.Write(bytes, 0, bytes.Length);
    os.Close();
    System.Net.WebResponse resp = req.GetResponse();
    if (resp == null) return null;
    System.IO.StreamReader sr = new System.IO.StreamReader(resp.GetResponseStream());
    return sr.ReadToEnd().Trim();
}


