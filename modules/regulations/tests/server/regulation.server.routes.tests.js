'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Regulation = mongoose.model('Regulation'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, regulation;

/**
 * Regulation routes tests
 */
describe('Regulation CRUD tests', function () {

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

    // Save a user to the test db and create new Regulation
    user.save(function () {
      regulation = {
        name: 'Regulation name'
      };

      done();
    });
  });

  it('should be able to save a Regulation if logged in', function (done) {
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

        // Save a new Regulation
        agent.post('/api/regulations')
          .send(regulation)
          .expect(200)
          .end(function (regulationSaveErr, regulationSaveRes) {
            // Handle Regulation save error
            if (regulationSaveErr) {
              return done(regulationSaveErr);
            }

            // Get a list of Regulations
            agent.get('/api/regulations')
              .end(function (regulationsGetErr, regulationsGetRes) {
                // Handle Regulation save error
                if (regulationsGetErr) {
                  return done(regulationsGetErr);
                }

                // Get Regulations list
                var regulations = regulationsGetRes.body;

                // Set assertions
                (regulations[0].user._id).should.equal(userId);
                (regulations[0].name).should.match('Regulation name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Regulation if not logged in', function (done) {
    agent.post('/api/regulations')
      .send(regulation)
      .expect(403)
      .end(function (regulationSaveErr, regulationSaveRes) {
        // Call the assertion callback
        done(regulationSaveErr);
      });
  });

  it('should not be able to save an Regulation if no name is provided', function (done) {
    // Invalidate name field
    regulation.name = '';

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

        // Save a new Regulation
        agent.post('/api/regulations')
          .send(regulation)
          .expect(400)
          .end(function (regulationSaveErr, regulationSaveRes) {
            // Set message assertion
            (regulationSaveRes.body.message).should.match('Please fill Regulation name');

            // Handle Regulation save error
            done(regulationSaveErr);
          });
      });
  });

  it('should be able to update an Regulation if signed in', function (done) {
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

        // Save a new Regulation
        agent.post('/api/regulations')
          .send(regulation)
          .expect(200)
          .end(function (regulationSaveErr, regulationSaveRes) {
            // Handle Regulation save error
            if (regulationSaveErr) {
              return done(regulationSaveErr);
            }

            // Update Regulation name
            regulation.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Regulation
            agent.put('/api/regulations/' + regulationSaveRes.body._id)
              .send(regulation)
              .expect(200)
              .end(function (regulationUpdateErr, regulationUpdateRes) {
                // Handle Regulation update error
                if (regulationUpdateErr) {
                  return done(regulationUpdateErr);
                }

                // Set assertions
                (regulationUpdateRes.body._id).should.equal(regulationSaveRes.body._id);
                (regulationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Regulations if not signed in', function (done) {
    // Create new Regulation model instance
    var regulationObj = new Regulation(regulation);

    // Save the regulation
    regulationObj.save(function () {
      // Request Regulations
      request(app).get('/api/regulations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Regulation if not signed in', function (done) {
    // Create new Regulation model instance
    var regulationObj = new Regulation(regulation);

    // Save the Regulation
    regulationObj.save(function () {
      request(app).get('/api/regulations/' + regulationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', regulation.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Regulation with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/regulations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Regulation is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Regulation which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Regulation
    request(app).get('/api/regulations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Regulation with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Regulation if signed in', function (done) {
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

        // Save a new Regulation
        agent.post('/api/regulations')
          .send(regulation)
          .expect(200)
          .end(function (regulationSaveErr, regulationSaveRes) {
            // Handle Regulation save error
            if (regulationSaveErr) {
              return done(regulationSaveErr);
            }

            // Delete an existing Regulation
            agent.delete('/api/regulations/' + regulationSaveRes.body._id)
              .send(regulation)
              .expect(200)
              .end(function (regulationDeleteErr, regulationDeleteRes) {
                // Handle regulation error error
                if (regulationDeleteErr) {
                  return done(regulationDeleteErr);
                }

                // Set assertions
                (regulationDeleteRes.body._id).should.equal(regulationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Regulation if not signed in', function (done) {
    // Set Regulation user
    regulation.user = user;

    // Create new Regulation model instance
    var regulationObj = new Regulation(regulation);

    // Save the Regulation
    regulationObj.save(function () {
      // Try deleting Regulation
      request(app).delete('/api/regulations/' + regulationObj._id)
        .expect(403)
        .end(function (regulationDeleteErr, regulationDeleteRes) {
          // Set message assertion
          (regulationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Regulation error error
          done(regulationDeleteErr);
        });

    });
  });

  it('should be able to get a single Regulation that has an orphaned user reference', function (done) {
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

          // Save a new Regulation
          agent.post('/api/regulations')
            .send(regulation)
            .expect(200)
            .end(function (regulationSaveErr, regulationSaveRes) {
              // Handle Regulation save error
              if (regulationSaveErr) {
                return done(regulationSaveErr);
              }

              // Set assertions on new Regulation
              (regulationSaveRes.body.name).should.equal(regulation.name);
              should.exist(regulationSaveRes.body.user);
              should.equal(regulationSaveRes.body.user._id, orphanId);

              // force the Regulation to have an orphaned user reference
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

                    // Get the Regulation
                    agent.get('/api/regulations/' + regulationSaveRes.body._id)
                      .expect(200)
                      .end(function (regulationInfoErr, regulationInfoRes) {
                        // Handle Regulation error
                        if (regulationInfoErr) {
                          return done(regulationInfoErr);
                        }

                        // Set assertions
                        (regulationInfoRes.body._id).should.equal(regulationSaveRes.body._id);
                        (regulationInfoRes.body.name).should.equal(regulation.name);
                        should.equal(regulationInfoRes.body.user, undefined);

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
      Regulation.remove().exec(done);
    });
  });
});
