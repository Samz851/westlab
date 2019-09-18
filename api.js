var crypto = require('crypto');
var algorithm = 'aes256';
var MongoClient = require('mongodb').MongoClient
var secretService = require('./secret-service');

// const db = require('./db.js');
module.exports = function(router){

        //const users = db.get().collection("users");

    // AWS.config.update({accessKeyId: process.env.AWS_ID , secretAccessKey: process.env.AWS_SECRET});

       //create the ddb object
    router.post('/login', (req, res) => {

        let { team, pass} = req.body;
        //pass = secretService.decrypt(pass);
        console.log(team + ' ' + pass);
        let client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
            if(err) throw err;
            let db = client.db('westlabDB');
            let users = db.collection('adminusers');

                users.findOne({
                    team: team,
                }).then((user) => {
                    console.log(user)
                    if(user){
                        pwd = secretService.decrypt(user.pass);
                        if(pwd == pass){
                            res.json({success: true, user: user.team, message: "Login Success"});
                        }
                    }

                })
        })

        //users.findOne({});

        // console.log(process.env.AWS_ID);

        // let params = {
        //     TableName: 'applicants',
        //     KeyConditionExpression: 'email = :i',
        //     ExpressionAttributeValues: {
        //       ':i': email
        //     }
        // }
        // let params = {
        //     TableName: 'adminusers',
        //     Key:{
        //         "team": team
        //     }
        // };
        // docClient.get(params, (err, data) => {
        //     if(err) console.log(err);
        //     if(data){
        //         console.log(data);
        //         var decipher = crypto.createDecipher(algorithm, process.env.CRY_KEY);
        //         var decrypted = decipher.update(data.Item.pass, 'hex', 'utf8') + decipher.final('utf8');
        //         console.log(decrypted);
        //         if(decrypted == pass ){
        //             res.json({success: true, user: data.Item});
        //         }

        //     }

        // })
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
        console.log(req.body);

        let { name, team, pass, email} = req.body;
        pass = secretService.encrypt(pass);
        console.log(team + ' ' + pass);
        let client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
            if(err) throw err;
            let db = client.db('westlabDB');
            let users = db.collection('adminusers');

            try{
                users.insertOne({
                    name: name,
                    team: team,
                    pass: pass,
                    email: email
                })
            }catch(err){
                throw err;
            }
        })



    });
    router.post('/add-application', (req, res) => {

        let client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
            if(err) throw err;
            let db = client.db('westlabDB');
            let applicants = db.collection('applicants');
            let applications = db.collection("applications");
            let methods = db.collection("methods");
            let userApplications = [];
                applicants.findOne({
                    name: req.body.applicant.name,
                }).then((applicant) => {
                    var methodsIds;
                    var applicantID;
                    if(!applicant){
                        applicants.insertOne(req.body.applicant, function(err, result) {
                            // console.log(err);
                            // console.log(result);
                            if(err) throw err;
                            applicantID = result.ops[0]._id;
                        })
                    }else{
                        applicantID = applicant._id;
                    }
                    console.log(applicant);
                    console.log(applicantID);
                    for(var method in req.body.application){
                        // console.log(req.body.application[method]);
                        req.body.application[method].applicantID = applicantID;
                        userApplications.push(req.body.application[method]);
                    }
                    methods.insertMany(userApplications, function (err, result) {
                        if(err) throw err;
                        console.log(Object.values(result.insertedIds));
                        methodsIds = Object.values(result.insertedIds);
                        applications.insertOne({applicant: applicantID, methods: methodsIds}, function(err, result){
                            console.log(result);
                            if(result.insertedCount > 0){
                                res.json({success: true, message: "Application submitted successfully"})
                            }
                        })

                    })
                        //     let applications = db.collection("applications");
                        //     let methods = db.collection("methods")
                        //     let userApplications = [];
                        //     // req.body.application.forEach(method => {
                        //     // });
                        //     for(var method in req.body.application){
                        //         // console.log(req.body.application[method]);
                        //         req.body.application[method].applicantID = applicantID;
                        //         userApplications.push(req.body.application[method]);

                        //     }
                        //     // console.log(userApplications);
                        //     applications.insertMany(userApplications, (err, result) => {
                        //         if(err) throw err;
                        //         console.log(result);

                        //     })
                        // });
                    

 

                })
        })


        // Configure the region

        // console.log(req.body)
        // AWS.config.update({accessKeyId: process.env.AWS_ID , secretAccessKey: process.env.AWS_SECRET});
        // AWS.config.region = 'us-west-2';  //us-west-2 is Oregon
        // let docClient = new AWS.DynamoDB.DocumentClient();
        // var applicantParams = {
        //     TableName : "applicants",
        //     Item: req.body.applicant
        // };
        // docClient.put(applicantParams, (err, data) => {
        //     if(err) {
        //         console.log(err);
        //     }else{
        //         // req.body.application.contact = req.body.applicant.contact;
                
        //         var applicationParams = {
        //             TableName : "applications",
        //             Item: req.body.application
        //         };
        //     }

        // })
    });



    return router;
}