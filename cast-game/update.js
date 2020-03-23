'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  console.log(event);

  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeValues: {
      ':hostCasterName':    data.host.casterName,
      ':hostTitle':         data.host.title,
      ':hostPoints':        data.host.points,
      ':caster1CasterName': data.caster1.casterName,
      ':caster1Title':      data.caster1.title,
      ':caster1Points':     data.caster1.points,
      ':caster2CasterName': data.caster2.casterName,
      ':caster2Title':      data.caster2.title,
      ':caster2Points':     data.caster2.points,
      ':caster3CasterName': data.caster3.casterName,
      ':caster3Title':      data.caster3.title,
      ':caster3Points':     data.caster3.points,
      ':caster4CasterName': data.caster4.casterName,
      ':caster4Title':      data.caster4.title,
      ':caster4Points':     data.caster4.points,
      ':updated': timestamp
    },
    UpdateExpression: "set " +
     "host.casterName=:hostCasterName, host.title=:hostTitle, host.points=:hostPoints, " +
     "caster1.casterName=:caster1CasterName, caster1.title=:caster1Title, caster1.points=:caster1Points, " +
     "caster2.casterName=:caster2CasterName, caster2.title=:caster2Title, caster2.points=:caster2Points, " +
     "caster3.casterName=:caster3CasterName, caster3.title=:caster3Title, caster3.points=:caster3Points, " +
     "caster4.casterName=:caster4CasterName, caster4.title=:caster4Title, caster4.points=:caster4Points, " +
      "updatedate=:updated", 
    ReturnValues: 'ALL_NEW'
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: 'Couldn\'t fetch the broadcast item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }
    };
    callback(null, response);
  });
};