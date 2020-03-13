'use strict';

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
      return {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the broadcast data.  Message: ' + error.message
      };
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

const create = async event => {

  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    ExpressionAttributeValues: {
      ':period': data.period,
      ':time': data.time,
      ':home.name': data.homeTeam.name,
      ':home.logo': data.homeTeam.logo,
      ':home.color': data.homeTeam.color,
      ':home.gamesWon': data.homeTeam.gamesWon,
      ':home.score': data.homeTeam.score,
      ':away.name': data.awayTeam.name,
      ':away.logo': data.awayTeam.logo,
      ':away.color': data.awayTeam.color,
      ':away.gamesWon': data.awayTeam.gamesWon,
      ':away.score': data.awayTeam.score,
      ':play.name': data.playByPlay.name,
      ':play.title': data.playByPlay.title,
      ':play.subtitle': data.playByPlay.subtitle,
      ':color.name': data.colorCommentary.name,
      ':color.title': data.colorCommentary.title,
      ':color.subtitle': data.colorCommentary.subtitle,
      ':field.name': data.fieldReporter.name,
      ':field.title': data.fieldReporter.title,
      ':field.subtitle': data.fieldReporter.subtitle

    },
    UpdateExpression: "set period=:period, time=:time, " +
      "homeTeam.name=:home.name, homeTeam.logo=:home.logo, homeTeam.color=:home.color, homeTeam.gamesWon=:home.gamesWon, homeTeam.score=:home.score, " +
      "awayTeam.name=:away.name, awayTeam.logo=:away.logo, awayTeam.color=:away.color, awayTeam.gamesWon=:away.gamesWon, awayTeam.score=:away.score, " +
      "playByPlay.name=:play.name, playByPlay.title=:play.title, playByPlay.subtitle=:play.subtitle, " +
      "colorCommentary.name=:color.name, colorCommentary.title=:color.title, colorCommentary.subtitle=:color.subtitle, " +
      "fieldReporter.name=:field.name, fieldReporter.title=:field.title, fieldReporter.subtitle=:field.subtitle, "
    , ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      return {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t save broadcast data.  Message: ' + JSON.stringify(error),
      };
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

const update = async event => {

  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    // ExpressionAttributeNames: {
    //     '#todo_text': 'text',
    // },
    ExpressionAttributeValues: {
      ':period': data.period,
      ':time': data.time,
      ':home.name': data.homeTeam.name,
      ':home.logo': data.homeTeam.logo,
      ':home.color': data.homeTeam.color,
      ':home.gamesWon': data.homeTeam.gamesWon,
      ':home.score': data.homeTeam.score,
      ':away.name': data.awayTeam.name,
      ':away.logo': data.awayTeam.logo,
      ':away.color': data.awayTeam.color,
      ':away.gamesWon': data.awayTeam.gamesWon,
      ':away.score': data.awayTeam.score,
      ':play.name': data.playByPlay.name,
      ':play.title': data.playByPlay.title,
      ':play.subtitle': data.playByPlay.subtitle,
      ':color.name': data.colorCommentary.name,
      ':color.title': data.colorCommentary.title,
      ':color.subtitle': data.colorCommentary.subtitle,
      ':field.name': data.fieldReporter.name,
      ':field.title': data.fieldReporter.title,
      ':field.subtitle': data.fieldReporter.subtitle

    },
    UpdateExpression: "set period=:period, time=:time, " +
      "homeTeam.name=:home.name, homeTeam.logo=:home.logo, homeTeam.color=:home.color, homeTeam.gamesWon=:home.gamesWon, homeTeam.score=:home.score, " +
      "awayTeam.name=:away.name, awayTeam.logo=:away.logo, awayTeam.color=:away.color, awayTeam.gamesWon=:away.gamesWon, awayTeam.score=:away.score, " +
      "playByPlay.name=:play.name, playByPlay.title=:play.title, playByPlay.subtitle=:play.subtitle, " +
      "colorCommentary.name=:color.name, colorCommentary.title=:color.title, colorCommentary.subtitle=:color.subtitle, " +
      "fieldReporter.name=:field.name, fieldReporter.title=:field.title, fieldReporter.subtitle=:field.subtitle, "
    , ReturnValues: 'UPDATED_NEW',
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      return {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t save broadcast data.  Message: ' + JSON.stringify(error),
      };
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

module.exports = { get, create, update }