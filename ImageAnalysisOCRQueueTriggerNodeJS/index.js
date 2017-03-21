var request = require('request');


module.exports = function (context, myQueueItem) {

    context.log('Node.js queue trigger function processed work item', myQueueItem);
    
    context.bindings.outputDocument = context.bindings.inputDocument;

    var queryString = 'language=unk&detectOrientation=true';

    request.post({
        url: 'https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr?' + queryString,
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.SubscriptionKey
        },
        json: { "url": context.bindings.inputDocument.imageUrl }
    },
        function (err, res, body) {
            if (err) {
                console.log('Error Analysing Image:', err);
            }
            //Check for right status code
            if (res.statusCode !== 200) {
                console.log('Invalid Status Code Returned:', res);
            }
            else {

                context.log('OCR', body);
                context.bindings.outputDocument.ocr = body;
                context.log('Written to DocumentDB', context.bindings.outputDocument);
                context.done();
            }
        });
};