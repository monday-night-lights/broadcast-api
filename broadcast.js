'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const get = async event => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  // fetch team from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the broadcast data.  Message: ' + error.message
      });
      return;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result,
        null,
        2
      ),
      "headers": {}
    };
  });
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

const update = async event => {

const params = {
  TableName: process.env.DYNAMODB_TABLE,
  Key: {
      id: event.pathParameters.id,
  },
  // ExpressionAttributeNames: {
  //     '#todo_text': 'text',
  // },
  ExpressionAttributeValues: {
      ':name': data.gameStartTime,
      ':longName': data.longName,
      ':primaryColor': primaryColor,
      ':secondaryColor': secondaryColor
  },
  UpdateExpression: 'SET name = :name, longName = :longName, primaryColor = :primaryColor, secondaryColor = :secondaryColor',
  ReturnValues: 'ALL_NEW',
};

// update the todo in the database
dynamoDb.update(params, (error, result) => {
  // handle potential errors
  if (error) {
      console.error(error);
      callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t fetch the team.',
      });
      return;
  }

  
  // write the team to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t save broadcast data.  Message: ' + JSON.stringify(error)
      });
      result = data;
    }


    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          input: event
        },
        null,
        2
      ),
      "headers": {}
    };

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
  });
};

module.exports = { get, update }