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
    // ExpressionAttributeNames: {
    //   '#timeleft': 'time',
    //   '#homeTeamName': 'homeTeam.name',
    //   '#awayTeamName': 'awayTeam.name',
    //   '#playByPlayName': 'playByPlay.name',
    //   '#colorCommentaryName': 'colorCommentary.name',
    //   '#fieldReporterName': 'fieldReporter.name'
    // },
    ExpressionAttributeValues: {
      ':period': data.period,
      ':timeleft': data.timeLeft,
      ':hometeam': data.homeTeam,
      ':awayTeam': data.awayTeam,
      ':playByPlay': data.playByPlay,
      ':colorCommentary': data.colorCommentary,
      ':fieldReporter': data.fieldReporter,
      ':updated': timestamp
    },
    UpdateExpression: "set period=:period, timeLeft=:timeleft, " +
      "homeTeam=:homeTeam, " +
      "awayTeame=:awayTeam, " +
      "playByPlay=:playByPlay, " +
      "colorCommentary=:colorCommentary, " +
      "fieldReporter=:fieldReporter, " +
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