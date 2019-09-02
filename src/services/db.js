'use strict';

function DBSvc($http, $sessionStorage, WPAConstants){
    AWS.config.update({accessKeyId: WPAConstants.awsKeyID , secretAccessKey: WPAConstants.awsKeySecret});
    // Configure the region
    AWS.config.region = 'us-west-2';  //us-west-2 is Oregon
    //create the ddb object
    var ddb = new AWS.DynamoDB();
    /*
    -----------------------------------------------------------------
    Update the Table
    -----------------------------------------------------------------
    */
    //update the table with this data
    var params = {
      Item: {
        aid: 1,
        email: 'sam@samiscoding.com',
        applicant: 'SAM DevOps',
        pass: btoa("R@w@n851"),
        phone: "6137161317"
      },
      TableName: 'applicants',    };
  //   var params = {
  //     TableName:"applicants",
  //     Key:{
  //         "aid": {N: '1'},
  //         "email":{S: 'sam@samiscoding.com'}
  //     },
  //     UpdateExpression: "set info.rating = :r, info.plot=:p, info.actors=:a",
  //     ExpressionAttributeValues:{
  //         ":r":5.5,
  //         ":p":"Everything happens all at once.",
  //         ":a":["Larry", "Moe", "Curly"]
  //     },
  //     ReturnValues:"UPDATED_NEW"
  // };
    //update the table
    // update();
    /*
    -----------------------------------------------------------------
    Get Item from the Table
    -----------------------------------------------------------------
    */
    //attribute to read
    var readparams = {
        
      Key: {
        name: {S: 'John Mayo-Smith'},
        city: {S: 'New York'}
      },
      AttributesToGet: ['food'],
      TableName: 'sampletable'
    };
    //get the item
    // read();
    /*
    -----------------------------------------------------------------
    function update()
    Description: Calls updateItem which is part of the AWS Javascript
    SDK.
    Returns: JSON object (the object is stringifyed so we can see 
    what's going on in the javascript console)
    -----------------------------------------------------------------
    */
    function update(){
        ddb.updateItem(params, function(err, data) {
            if (err) { return console.log(err); }
            console.log("We updated the table with this: " + JSON.stringify(data));
        });
    };
    /*    -----------------------------------------------------------------
    function insert()
    Description: Calls putItem which is part of the AWS Javascript
    SDK.
    Returns: JSON object (the object is stringifyed so we can see 
    what's going on in the javascript console)
    -----------------------------------------------------------------
    */
    function insert(){
      let docClient = new AWS.DynamoDB.DocumentClient();
      docClient.put(params, function(err, data) {
        if (err) {
            console.log("Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
           console.log("PutItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2));
        }
    });;
  }
    /*
    -----------------------------------------------------------------
    function read()
    Description: Calls getItem which is part of the AWS Javascript
    SDK.
    Returns: JSON object (the object is stringifyed so we can see 
    what's going on in the javascript console)
    -----------------------------------------------------------------
    */
    function read(){
        ddb.getItem(readparams, function(err, data) {
            if (err) { return console.log(err); }
            console.log(": " + data);		
            
        console.log("John's favorite food is: "+ JSON.stringify(data.Item.food.S)); // print the item data
    });
    }

    function createTable(){
        var tableParams = {
            AttributeDefinitions: [
               {
              AttributeName: "name", 
              AttributeType: "S"
             }, 
               {
              AttributeName: "city", 
              AttributeType: "S"
             }
            ], 
            KeySchema: [
               {
              AttributeName: "name", 
              KeyType: "HASH"
             }, 
               {
              AttributeName: "city", 
              KeyType: "RANGE"
             }
            ], 
            ProvisionedThroughput: {
             ReadCapacityUnits: 5, 
             WriteCapacityUnits: 5
            }, 
            TableName: "sampletable"
           };
        ddb.createTable(tableParams, (err) => {
            if(err){
                console.log('Errror');
                console.log(err);
            }else{
                console.log('Table created');
            }
        });
    }

  return {
    read: read,
    update: update,
    insert: insert,
    createTable: createTable
  }

}

const serviceConfig = [
  '$http',
  '$sessionStorage',
  'WPAConstants',
  DBSvc
]

angular.module('WPA')
  .factory('DBSvc', serviceConfig)

module.exports = {
  name: 'DBSvc',
  factory: serviceConfig
}
