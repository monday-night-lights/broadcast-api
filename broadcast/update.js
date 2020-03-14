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
    //     '#period':          'text',
    //     '#time':            'text',
    //     '#homename':       'text',
    //     '#homelogo':       'text',
    //     '#homecolor':      'text',
    //     '#homegamesWon':   'text',
    //     '#homescore':      'text',
    //     '#awayname':       'text',
    //     '#awaylogo':       'text',
    //     '#awaycolor':      'text',
    //     '#awaygamesWon':   'text',
    //     '#awayscore':      'text',
    //     '#playname':       'text',
    //     '#playtitle':      'text',
    //     '#playsubtitle':   'text',
    //     '#colorname':      'text',
    //     '#colortitle':     'text',
    //     '#colorsubtitle':  'text',
    //     '#fieldname':      'text',
    //     '#fieldtitle':     'text',
    //     '#fieldsubtitle':  'text'
    //   },
    ExpressionAttributeValues: {
      ':period': data.period,
      ':time': data.time,
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
      ':playname': data.playByplayname,
      ':playtitle': data.playByplaytitle,
      ':playsubtitle': data.playByplaysubtitle,
      ':colorname': data.colorCommentary.name,
      ':colortitle': data.colorCommentary.title,
      ':colorsubtitle': data.colorCommentary.subtitle,
      ':fieldname': data.fieldReporter.name,
      ':fieldtitle': data.fieldReporter.title,
      ':fieldsubtitle': data.fieldReporter.subtitle,
      ':updated': timestamp
    },
    UpdateExpression: "set period=:period, time=:time, " +
      "homeTeam.name=:homename, homeTeam.logo=:homelogo, homeTeam.color=:homecolor, homeTeam.gamesWon=:homegamesWon, homeTeam.score=:homescore, " +
      "awayTeam.name=:awayname, awayTeam.logo=:awaylogo, awayTeam.color=:awaycolor, awayTeam.gamesWon=:awaygamesWon, awayTeam.score=:awayscore, " +
      "playByplayname=:playname, playByplaytitle=:playtitle, playByplaysubtitle=:playsubtitle, " +
      "colorCommentary.name=:colorname, colorCommentary.title=:colortitle, colorCommentary.subtitle=:colorsubtitle, " +
      "fieldReporter.name=:fieldname, fieldReporter.title=:fieldtitle, fieldReporter.subtitle=:fieldsubtitle, updateddate=:updated",
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
    };
    callback(null, response);
  });
};