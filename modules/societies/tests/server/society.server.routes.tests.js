'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Society = mongoose.model('Society'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, society;

/**
 * Society routes tests
 */
describe('Society CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Society
    user.save(function () {
      society = {
        name: 'Society name'
      };

      done();
    });
  });

  it('should be able to save a Society if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Society
        agent.post('/api/societies')
          .send(society)
          .expect(200)
          .end(function (societySaveErr, societySaveRes) {
            // Handle Society save error
            if (societySaveErr) {
              return done(societySaveErr);
            }

            // Get a list of Societies
            agent.get('/api/societies')
              .end(function (societysGetErr, societysGetRes) {
                // Handle Society save error
                if (societysGetErr) {
                  return done(societysGetErr);
                }

                // Get Societies list
                var societies = societiesGetRes.body;

                // Set assertions
                (societies[0].user._id).should.equal(userId);
                (societies[0].name).should.match('Society name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Society if not logged in', function (done) {
    agent.post('/api/societies')
      .send(society)
      .expect(403)
      .end(function (societySaveErr, societySaveRes) {
        // Call the assertion callback
        done(societySaveErr);
      });
  });

  it('should not be able to save an Society if no name is provided', function (done) {
    // Invalidate name field
    society.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Society
        agent.post('/api/societies')
          .send(society)
          .expect(400)
          .end(function (societySaveErr, societySaveRes) {
            // Set message assertion
            (societySaveRes.body.message).should.match('Please fill Society name');

            // Handle Society save error
            done(societySaveErr);
          });
      });
  });

  it('should be able to update an Society if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Society
        agent.post('/api/societies')
          .send(society)
          .expect(200)
          .end(function (societySaveErr, societySaveRes) {
            // Handle Society save error
            if (societySaveErr) {
              return done(societySaveErr);
            }

            // Update Society name
            society.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Society
            agent.put('/api/societies/' + societySaveRes.body._id)
              .send(society)
              .expect(200)
              .end(function (societyUpdateErr, societyUpdateRes) {
                // Handle Society update error
                if (societyUpdateErr) {
                  return done(societyUpdateErr);
                }

                // Set assertions
                (societyUpdateRes.body._id).should.equal(societySaveRes.body._id);
                (societyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Societies if not signed in', function (done) {
    // Create new Society model instance
    var societyObj = new Society(society);

    // Save the society
    societyObj.save(function () {
      // Request Societies
      request(app).get('/api/societies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Society if not signed in', function (done) {
    // Create new Society model instance
    var societyObj = new Society(society);

    // Save the Society
    societyObj.save(function () {
      request(app).get('/api/societies/' + societyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', society.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Society with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/societies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Society is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Society which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Society
    request(app).get('/api/societies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Society with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Society if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Society
        agent.post('/api/societies')
          .send(society)
          .expect(200)
          .end(function (societySaveErr, societySaveRes) {
            // Handle Society save error
            if (societySaveErr) {
              return done(societySaveErr);
            }

            // Delete an existing Society
            agent.delete('/api/societies/' + societySaveRes.body._id)
              .send(society)
              .expect(200)
              .end(function (societyDeleteErr, societyDeleteRes) {
                // Handle society error error
                if (societyDeleteErr) {
                  return done(societyDeleteErr);
                }

                // Set assertions
                (societyDeleteRes.body._id).should.equal(societySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Society if not signed in', function (done) {
    // Set Society user
    society.user = user;

    // Create new Society model instance
    var societyObj = new Society(society);

    // Save the Society
    societyObj.save(function () {
      // Try deleting Society
      request(app).delete('/api/societies/' + societyObj._id)
        .expect(403)
        .end(function (societyDeleteErr, societyDeleteRes) {
          // Set message assertion
          (societyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Society error error
          done(societyDeleteErr);
        });

    });
  });

  it('should be able to get a single Society that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Society
          agent.post('/api/societies')
            .send(society)
            .expect(200)
            .end(function (societySaveErr, societySaveRes) {
              // Handle Society save error
              if (societySaveErr) {
                return done(societySaveErr);
              }

              // Set assertions on new Society
              (societySaveRes.body.name).should.equal(society.name);
              should.exist(societySaveRes.body.user);
              should.equal(societySaveRes.body.user._id, orphanId);

              // force the Society to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Society
                    agent.get('/api/societies/' + societySaveRes.body._id)
                      .expect(200)
                      .end(function (societyInfoErr, societyInfoRes) {
                        // Handle Society error
                        if (societyInfoErr) {
                          return done(societyInfoErr);
                        }

                        // Set assertions
                        (societyInfoRes.body._id).should.equal(societySaveRes.body._id);
                        (societyInfoRes.body.name).should.equal(society.name);
                        should.equal(societyInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Society.remove().exec(done);
    });
  });
});
