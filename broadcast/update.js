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
      ':period': data.period,
      ':homename': data.homeTeam.teamName,
      ':homelogo': data.homeTeam.logo,
      ':homecolor': data.homeTeam.color,
      ':homeplayersonice': data.homeTeam.playersOnIce,
      ':homegamesWon': data.homeTeam.gamesWon,
      ':homescore': data.homeTeam.score,
      ':awayname': data.awayTeam.teamName,
      ':awaylogo': data.awayTeam.logo,
      ':awaycolor': data.awayTeam.color,
      ':awayplayersonice': data.awayTeam.playersOnIce,
      ':awaygamesWon': data.awayTeam.gamesWon,
      ':awayscore': data.awayTeam.score,
      ':playname': data.playByPlay.announcerName,
      ':playtitle': data.playByPlay.title,
      ':playsubtitle': data.playByPlay.subtitle,
      ':playorder': data.playByPlay.order,
      ':colorname': data.colorCommentary.announcerName,
      ':colortitle': data.colorCommentary.title,
      ':colorsubtitle': data.colorCommentary.subtitle,
      ':colororder': data.colorCommentary.order,
      ':fieldname': data.fieldReporter.announcerName,
      ':fieldtitle': data.fieldReporter.title,
      ':fieldsubtitle': data.fieldReporter.subtitle,
      ':fieldorder': data.fieldReporter.order,
      ':playername': data.player.announcerName,
      ':playertitle': data.player.title,
      ':playersubtitle': data.player.subtitle,
      ':playerorder': data.player.order,
      ':updated': timestamp
    },
    UpdateExpression: "set period=:period, " +
      //"timeLeft=:timeleft, " +
      "homeTeam.teamName=:homename, homeTeam.logo=:homelogo, homeTeam.color=:homecolor, homeTeam.gamesWon=:homegamesWon, homeTeam.playersOnIce=:homeplayersonice, homeTeam.score=:homescore, " +
      "awayTeam.teamName=:awayname, awayTeam.logo=:awaylogo, awayTeam.color=:awaycolor, awayTeam.gamesWon=:awaygamesWon, awayTeam.playersOnIce=:awayplayersonice, awayTeam.score=:awayscore, " +
      "playByPlay.announcerName=:playname, playByPlay.title=:playtitle, playByPlay.subtitle=:playsubtitle, playByPlay.order=:playorder, " +
      "colorCommentary.announcerName=:colorname, colorCommentary.title=:colortitle, colorCommentary.subtitle=:colorsubtitle, colorCommentary.order=:colororder, " +
      "fieldReporter.announcerName=:fieldname, fieldReporter.title=:fieldtitle, fieldReporter.subtitle=:fieldsubtitle, fieldReporter.order=:fieldorder, " + 
      "player.announcerName=:playername, player.title=:playertitle, player.subtitle=:playersubtitle, player.order=:playerorder, " +
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
        'Access-Control-Allow-Origin': '*'
      }
    };
    callback(null, response);
  });
};