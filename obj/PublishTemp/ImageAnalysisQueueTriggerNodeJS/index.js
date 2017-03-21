
var request = require('request');

module.exports = function (context, myQueueItem, outputDocument) {

    context.log('Node.js queue trigger function processed work item', myQueueItem);

    var queryString = 'visualFeatures=Categories,Tags,Description,Faces,ImageType,Color,Adult&language=en';

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
              
                context.log('Written to DocumentDB', body);
                context.bindings.outputDocument = body;
               
            }
            context.done();
        });

}