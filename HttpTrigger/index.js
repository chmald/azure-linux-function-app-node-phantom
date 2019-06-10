const phantom = require('phantom');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.pageUrl || (req.body && req.body.pageUrl)) {
        var response = '';

        const inputUrl = req.query.pageUrl;
        try {
            response = await testPhantom(inputUrl);
        } catch (err) {
            context.log('Phantom error: ' + err);
            response = 'Phantom error: ' + err;
        }

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: response
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a pageUrl on the query string or in the request body"
        };
    }
};

async function testPhantom(url) {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onResourceRequested', function(requestData) {
        console.log('Requesting', requestData.url);
    });

    const status = await page.open(url);
    const content = await page.property('content');
    console.log(content);

    await instance.exit();

    return content;
}