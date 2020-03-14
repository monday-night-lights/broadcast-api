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
    ExpressionAttributeNames: {
      '#timeleft': 'time',
      '#homeTeamName': 'homeTeam.name',
      '#awayTeamName': 'awayTeam.name',
      '#playByPlayName': 'playByPlay.name',
      '#colorCommentaryName': 'colorCommentary.name',
      '#fieldReporterName': 'fieldReporter.name'
    },
    ExpressionAttributeValues: {
      ':period': data.period,
      ':timeleft': data.time,
      ':homename': data.homeTeam.name,
      ':homelogo': data.homeTeam.logo,
      ':homecolor': data.homeTeam.color,
      ':homegamesWon': data.homeTeam.gamesWon,
      ':homescore': data.homeTeam.score,
      ':awayname': data.awayTeam.name,
      ':awaylogo': data.awayTeam.logo,
      ':awaycolor': data.awayTeam.color,
      ':awaygamesWon': data.awayTeam.gamesWon,
      ':awayscore': data.awayTeam.score,
      ':playname': data.playByPlay.name,
      ':playtitle': data.playByPlay.title,
      ':playsubtitle': data.playByPlay.subtitle,
      ':colorname': data.colorCommentary.name,
      ':colortitle': data.colorCommentary.title,
      ':colorsubtitle': data.colorCommentary.subtitle,
      ':fieldname': data.fieldReporter.name,
      ':fieldtitle': data.fieldReporter.title,
      ':fieldsubtitle': data.fieldReporter.subtitle,
      ':updated': timestamp
    },
    UpdateExpression: "set period=:period, #timeleft=:timeleft, " +
      "#homeTeamName=:homename, homeTeam.logo=:homelogo, homeTeam.color=:homecolor, homeTeam.gamesWon=:homegamesWon, homeTeam.score=:homescore, " +
      "#awayTeamName=:awayname, awayTeam.logo=:awaylogo, awayTeam.color=:awaycolor, awayTeam.gamesWon=:awaygamesWon, awayTeam.score=:awayscore, " +
      "#playByPlayName=:playname, playByPlay.title=:playtitle, playByPlay.subtitle=:playsubtitle, " +
      "#colorCommentaryName=:colorname, colorCommentary.title=:colortitle, colorCommentary.subtitle=:colorsubtitle, " +
      "#fieldReporterName=:fieldname, fieldReporter.title=:fieldtitle, fieldReporter.subtitle=:fieldsubtitle, updatedate=:updated",
    ReturnValues: 'ALL_NEW'
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
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