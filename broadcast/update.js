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
      ':homename': data.homeTeam.teamName,
      ':homelogo': data.homeTeam.logo,
      ':homecolor': data.homeTeam.color,
      ':homegamesWon': data.homeTeam.gamesWon,
      ':homescore': data.homeTeam.score,
      ':awayname': data.awayTeam.teamName,
      ':awaylogo': data.awayTeam.logo,
      ':awaycolor': data.awayTeam.color,
      ':awaygamesWon': data.awayTeam.gamesWon,
      ':awayscore': data.awayTeam.score,
      ':playname': data.playByPlay.announcerName,
      ':playtitle': data.playByPlay.title,
      ':playsubtitle': data.playByPlay.subtitle,
      ':colorname': data.colorCommentary.announcerName,
      ':colortitle': data.colorCommentary.title,
      ':colorsubtitle': data.colorCommentary.subtitle,
      ':fieldname': data.fieldReporter.announcerName,
      ':fieldtitle': data.fieldReporter.title,
      ':fieldsubtitle': data.fieldReporter.subtitle,
      ':updated': timestamp
    },
    UpdateExpression: "set period=:period, timeLeft=:timeleft, " +
      "homeTeam.teamName=:homename, homeTeam.logo=:homelogo, homeTeam.color=:homecolor, homeTeam.gamesWon=:homegamesWon, homeTeam.score=:homescore, " +
      "awayTeam.teamName=:awayname, awayTeam.logo=:awaylogo, awayTeam.color=:awaycolor, awayTeam.gamesWon=:awaygamesWon, awayTeam.score=:awayscore, " +
      "playByPlay.announcerName=:playname, playByPlay.title=:playtitle, playByPlay.subtitle=:playsubtitle, " +
      "colorCommentary.announcerName=:colorname, colorCommentary.title=:colortitle, colorCommentary.subtitle=:colorsubtitle, " +
      "fieldReporter.announcerName=:fieldname, fieldReporter.title=:fieldtitle, fieldReporter.subtitle=:fieldsubtitle, updatedate=:updated",
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