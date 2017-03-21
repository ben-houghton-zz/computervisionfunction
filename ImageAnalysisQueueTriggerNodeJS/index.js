
var request = require('request');
var uuidV1 = require('uuid/v1');

module.exports = function (context, myQueueItem, outputDocument, myOutQueueItem) {

    context.log('Node.js queue trigger function processed work item', myQueueItem);

    var queryString = 'visualFeatures=Categories,Tags,Description,Faces,ImageType,Color,Adult&language=en';

    var documentId = uuidV1();

    request.post({
        url: 'https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?'+ queryString,
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.SubscriptionKey
        },
        json: { "url": myQueueItem }
        },
        function (err, res, body) {
            if (err)
            {
                console.log('Error Analysing Image:', err);
            }
            //Check for right status code
            if (res.statusCode !== 200) {
                console.log('Invalid Status Code Returned:', res);
            }
            else {
              

                context.bindings.outputDocument = body;
                context.bindings.outputDocument.id = documentId;
                context.bindings.outputDocument.imageUrl = myQueueItem;
                context.log('Written to DocumentDB', context.bindings.outputDocument);
                context.bindings.myOutQueueItem = documentId;
                context.log('OutputQueue', documentId);
                context.done();
            }
        });

}