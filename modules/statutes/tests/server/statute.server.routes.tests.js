'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Statute = mongoose.model('Statute'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, statute;

/**
 * Statute routes tests
 */
describe('Statute CRUD tests', function () {

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

    // Save a user to the test db and create new Statute
    user.save(function () {
      statute = {
        name: 'Statute name'
      };

      done();
    });
  });

  it('should be able to save a Statute if logged in', function (done) {
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

        // Save a new Statute
        agent.post('/api/statutes')
          .send(statute)
          .expect(200)
          .end(function (statuteSaveErr, statuteSaveRes) {
            // Handle Statute save error
            if (statuteSaveErr) {
              return done(statuteSaveErr);
            }

            // Get a list of Statutes
            agent.get('/api/statutes')
              .end(function (statutesGetErr, statutesGetRes) {
                // Handle Statute save error
                if (statutesGetErr) {
                  return done(statutesGetErr);
                }

                // Get Statutes list
                var statutes = statutesGetRes.body;

                // Set assertions
                (statutes[0].user._id).should.equal(userId);
                (statutes[0].name).should.match('Statute name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Statute if not logged in', function (done) {
    agent.post('/api/statutes')
      .send(statute)
      .expect(403)
      .end(function (statuteSaveErr, statuteSaveRes) {
        // Call the assertion callback
        done(statuteSaveErr);
      });
  });

  it('should not be able to save an Statute if no name is provided', function (done) {
    // Invalidate name field
    statute.name = '';

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

        // Save a new Statute
        agent.post('/api/statutes')
          .send(statute)
          .expect(400)
          .end(function (statuteSaveErr, statuteSaveRes) {
            // Set message assertion
            (statuteSaveRes.body.message).should.match('Please fill Statute name');

            // Handle Statute save error
            done(statuteSaveErr);
          });
      });
  });

  it('should be able to update an Statute if signed in', function (done) {
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

        // Save a new Statute
        agent.post('/api/statutes')
          .send(statute)
          .expect(200)
          .end(function (statuteSaveErr, statuteSaveRes) {
            // Handle Statute save error
            if (statuteSaveErr) {
              return done(statuteSaveErr);
            }

            // Update Statute name
            statute.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Statute
            agent.put('/api/statutes/' + statuteSaveRes.body._id)
              .send(statute)
              .expect(200)
              .end(function (statuteUpdateErr, statuteUpdateRes) {
                // Handle Statute update error
                if (statuteUpdateErr) {
                  return done(statuteUpdateErr);
                }

                // Set assertions
                (statuteUpdateRes.body._id).should.equal(statuteSaveRes.body._id);
                (statuteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Statutes if not signed in', function (done) {
    // Create new Statute model instance
    var statuteObj = new Statute(statute);

    // Save the statute
    statuteObj.save(function () {
      // Request Statutes
      request(app).get('/api/statutes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Statute if not signed in', function (done) {
    // Create new Statute model instance
    var statuteObj = new Statute(statute);

    // Save the Statute
    statuteObj.save(function () {
      request(app).get('/api/statutes/' + statuteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', statute.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Statute with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/statutes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Statute is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Statute which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Statute
    request(app).get('/api/statutes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Statute with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Statute if signed in', function (done) {
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

        // Save a new Statute
        agent.post('/api/statutes')
          .send(statute)
          .expect(200)
          .end(function (statuteSaveErr, statuteSaveRes) {
            // Handle Statute save error
            if (statuteSaveErr) {
              return done(statuteSaveErr);
            }

            // Delete an existing Statute
            agent.delete('/api/statutes/' + statuteSaveRes.body._id)
              .send(statute)
              .expect(200)
              .end(function (statuteDeleteErr, statuteDeleteRes) {
                // Handle statute error error
                if (statuteDeleteErr) {
                  return done(statuteDeleteErr);
                }

                // Set assertions
                (statuteDeleteRes.body._id).should.equal(statuteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Statute if not signed in', function (done) {
    // Set Statute user
    statute.user = user;

    // Create new Statute model instance
    var statuteObj = new Statute(statute);

    // Save the Statute
    statuteObj.save(function () {
      // Try deleting Statute
      request(app).delete('/api/statutes/' + statuteObj._id)
        .expect(403)
        .end(function (statuteDeleteErr, statuteDeleteRes) {
          // Set message assertion
          (statuteDeleteRes.body.message).should.match('User is not authorized');

          // Handle Statute error error
          done(statuteDeleteErr);
        });

    });
  });

  it('should be able to get a single Statute that has an orphaned user reference', function (done) {
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

          // Save a new Statute
          agent.post('/api/statutes')
            .send(statute)
            .expect(200)
            .end(function (statuteSaveErr, statuteSaveRes) {
              // Handle Statute save error
              if (statuteSaveErr) {
                return done(statuteSaveErr);
              }

              // Set assertions on new Statute
              (statuteSaveRes.body.name).should.equal(statute.name);
              should.exist(statuteSaveRes.body.user);
              should.equal(statuteSaveRes.body.user._id, orphanId);

              // force the Statute to have an orphaned user reference
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

                    // Get the Statute
                    agent.get('/api/statutes/' + statuteSaveRes.body._id)
                      .expect(200)
                      .end(function (statuteInfoErr, statuteInfoRes) {
                        // Handle Statute error
                        if (statuteInfoErr) {
                          return done(statuteInfoErr);
                        }

                        // Set assertions
                        (statuteInfoRes.body._id).should.equal(statuteSaveRes.body._id);
                        (statuteInfoRes.body.name).should.equal(statute.name);
                        should.equal(statuteInfoRes.body.user, undefined);

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
      Statute.remove().exec(done);
    });
  });
});
