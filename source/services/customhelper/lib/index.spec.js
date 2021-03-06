'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;
const sinon = require('sinon');
const sinonTest = require('sinon-test');
const test = sinonTest(sinon);
const Promise = require('promise');
const AWS = require('aws-sdk-mock');
let CustomResourceHelper = require('./index');

describe('#CustomResourceHelper', function() {
  describe('#events', function() {
    const sample_create_event = {
      RequestType: 'Create',
      ResponseURL: 'http://pre-signed-S3-url-for-response',
      StackId: 'arn:aws:cloudformation:us-west-2:EXAMPLE/stack-name/guid',
      RequestId: 'unique id for this create request',
      ResourceType: 'Custom::TestResource',
      LogicalResourceId: 'CreateUUID',
      ResourceProperties: {},
    };

    const sample_context = {
      logStreamName: 'sample-log-stream-name',
    };

    beforeEach(function() {});
    afterEach(function() {});

    xit('check for CREATE', function() {});
    xit('check for UPDATE', function() {});
    xit('check for DELETE', function() {});

    xit('should return error for sendResponse', function() {
      CustomResourceHelper.respond(
        sample_create_event,
        sample_context,
        function(data) {
          assert(data.errno, 'ENOTFOUND');
        }
      );
    });
  });

  describe('#validate for createSSMParameter', function() {
    const slackParamsBothExist = {
      Parameters: [
        {
          Name: 'slackchannelkey',
          Type: 'String',
          Value: 'testchannel',
          Version: 1,
          LastModifiedDate: '2019-03-14T18:58:31.630Z',
          ARN: 'arn:aws:ssm:us-east-1:99999999:parameter/slackchannelkey',
        },
        {
          Name: 'slackhookkey',
          Type: 'String',
          Value: 'testhook',
          Version: 1,
          LastModifiedDate: '2019-03-14T18:58:19.958Z',
          ARN: 'arn:aws:ssm:us-east-1:99999999:parameter/slackhookkey',
        },
      ],
      InvalidParameters: [],
    };
    const slackParams1Exists = {
      Parameters: [
        {
          Name: 'slackchannelkey',
          Type: 'String',
          Value: 'testchannel',
          Version: 1,
          LastModifiedDate: '2019-03-14T18:58:31.630Z',
          ARN: 'arn:aws:ssm:us-east-1:99999999:parameter/slackchannelkey',
        },
      ],
      InvalidParameters: ['slackhookkey'],
    };

    const slackParams0Exists = {
      Parameters: [],
      InvalidParameters: ['slackchannelkey', 'slackhookkey'],
    };

    it(
      '#TDD validate createSSMParameter',
      test(function() {
        expect(CustomResourceHelper.createSSMParameter).to.be.a('function');
      })
    );

    it(
      '#TDD check for unsuccessful getParameters api calls',
      test(function() {
        AWS.mock(
          'SSM',
          'getParameters',
          Promise.reject('error in aws getParameters call')
        );
        CustomResourceHelper.createSSMParameter(
          'slackchannel',
          'slackhook',
          function(data) {
            assert.deepEqual(data, 'error in aws getParameters call');
          }
        );
        AWS.restore('SSM');
      })
    );
  });
});
