var crypto = require('crypto');
var algorithm = 'aes256';
module.exports = function(router, AWS){
    // AWS.config.update({accessKeyId: process.env.AWS_ID , secretAccessKey: process.env.AWS_SECRET});

       //create the ddb object
    router.post('/login', (req, res) => {
        AWS.config.update({accessKeyId: process.env.AWS_ID , secretAccessKey: process.env.AWS_SECRET});
        AWS.config.region = 'us-west-2';  //us-west-2 is Oregon


        var {email, pass} = req.body;

        let docClient = new AWS.DynamoDB.DocumentClient();

        console.log(email + ' ' + pass);
        // console.log(process.env.AWS_ID);

        // let params = {
        //     TableName: 'applicants',
        //     KeyConditionExpression: 'email = :i',
        //     ExpressionAttributeValues: {
        //       ':i': email
        //     }
        // }
        let params = {
            TableName: 'applicants',
            Key:{
                "email": email
            }
        };
        docClient.get(params, (err, data) => {
            if(err) console.log(err);
            if(data){
                console.log(data);
                var decipher = crypto.createDecipher(algorithm, process.env.CRY_KEY);
                var decrypted = decipher.update(data.Item.pass, 'hex', 'utf8') + decipher.final('utf8');
                console.log(decrypted);
                if(decrypted == pass ){
                    res.json({success: true, user: {name: data.Item.applicant, email: email, phone: data.Item.phone, contact: data.Item.contact}});
                }

            }

        })
    });
    router.get('/createtable', (req, res) => {
            // Configure the region
    AWS.config.update({accessKeyId: process.env.AWS_ID , secretAccessKey: process.env.AWS_SECRET});
    AWS.config.region = 'us-west-2';  //us-west-2 is Oregon
        var ddb = new AWS.DynamoDB();

        var params = {
            TableName : "applicants",
            KeySchema: [       
                { AttributeName: "email", KeyType: "HASH"},  //Partition key
            ],
            AttributeDefinitions: [       
                { AttributeName: "email", AttributeType: "S" },
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 10, 
                WriteCapacityUnits: 10
            }
        };
        ddb.createTable(params, (err, data) => {
            if(err) console.log(err);
            console.log(data);
        })
    });
    router.post('/adduser', (req, res) => {
        // Configure the region
        AWS.config.update({accessKeyId: process.env.AWS_ID , secretAccessKey: process.env.AWS_SECRET});
        AWS.config.region = 'us-west-2';  //us-west-2 is Oregon
        let docClient = new AWS.DynamoDB.DocumentClient();
        var cipher = crypto.createCipher(algorithm, process.env.CRY_KEY);  
        var encrypted = cipher.update("R@w@n851", 'utf8', 'hex') + cipher.final('hex');
        var params = {
            TableName : "applicants",
            Item: {
                aid: 1,
                email: 'sam@samiscoding.com',
                applicant: 'SAM DevOps',
                contact: 'Samer Alotaibi',
                pass: encrypted,
                phone: "6137161317"
            }
        };
        docClient.put(params, (err, data) => {
            if(err) console.log(err);
            console.log(data);
        })
}); 



    return router;
}