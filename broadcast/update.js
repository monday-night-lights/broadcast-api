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
    //     '#home.name':       'text',
    //     '#home.logo':       'text',
    //     '#home.color':      'text',
    //     '#home.gamesWon':   'text',
    //     '#home.score':      'text',
    //     '#away.name':       'text',
    //     '#away.logo':       'text',
    //     '#away.color':      'text',
    //     '#away.gamesWon':   'text',
    //     '#away.score':      'text',
    //     '#play.name':       'text',
    //     '#play.title':      'text',
    //     '#play.subtitle':   'text',
    //     '#color.name':      'text',
    //     '#color.title':     'text',
    //     '#color.subtitle':  'text',
    //     '#field.name':      'text',
    //     '#field.title':     'text',
    //     '#field.subtitle':  'text'
    //   },
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
      ,ReturnValues: 'ALL_NEW',
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


const update = async event => {

    console.log(event);
    const data = JSON.parse(event.body);
  
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: event.queryStringParameters.id,
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
  
      console.log(result);
  
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
        "headers": {}
      };
  
      // Use this code if you don't use the http event with the LAMBDA-PROXY integration
      // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
    });
  };
  