'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  console.log(event);

  const timestamp = new Date().getTime();
  const pick = JSON.parse(event.body);

  var params;

  if (pick === null) {
    params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: { id: event.pathParameters.id },
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'set #draftPicks = :empty_list',
      ExpressionAttributeNames: {
        '#draftPicks': 'draftPicks'
      },
      ExpressionAttributeValues: {
        ':empty_list': []
      }
    };
  }
  else {
    params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: { id: event.pathParameters.id },
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'set #draftPicks = list_append(if_not_exists(#draftPicks, :empty_list), :team)',
      ExpressionAttributeNames: {
        '#draftPicks': 'draftPicks'
      },
      ExpressionAttributeValues: {
        ':team': [pick],
        ':empty_list': []
      }
    };
  }

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
        body: 'Couldn\'t fetch the draft item.',
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

module.exports.get = (event, context, callback) => {
  console.log(event);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  // fetch todo from the database
  dynamoDb.get(params, (error, result) => {
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
        body: 'Couldn\'t fetch the draft item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};