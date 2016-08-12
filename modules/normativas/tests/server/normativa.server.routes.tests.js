'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Normativa = mongoose.model('Normativa'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, normativa;

/**
 * Normativa routes tests
 */
describe('Normativa CRUD tests', function () {

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

    // Save a user to the test db and create new Normativa
    user.save(function () {
      normativa = {
        name: 'Normativa name'
      };

      done();
    });
  });

  it('should be able to save a Normativa if logged in', function (done) {
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

        // Save a new Normativa
        agent.post('/api/normativas')
          .send(normativa)
          .expect(200)
          .end(function (normativaSaveErr, normativaSaveRes) {
            // Handle Normativa save error
            if (normativaSaveErr) {
              return done(normativaSaveErr);
            }

            // Get a list of Normativas
            agent.get('/api/normativas')
              .end(function (normativasGetErr, normativasGetRes) {
                // Handle Normativa save error
                if (normativasGetErr) {
                  return done(normativasGetErr);
                }

                // Get Normativas list
                var normativas = normativasGetRes.body;

                // Set assertions
                (normativas[0].user._id).should.equal(userId);
                (normativas[0].name).should.match('Normativa name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Normativa if not logged in', function (done) {
    agent.post('/api/normativas')
      .send(normativa)
      .expect(403)
      .end(function (normativaSaveErr, normativaSaveRes) {
        // Call the assertion callback
        done(normativaSaveErr);
      });
  });

  it('should not be able to save an Normativa if no name is provided', function (done) {
    // Invalidate name field
    normativa.name = '';

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

        // Save a new Normativa
        agent.post('/api/normativas')
          .send(normativa)
          .expect(400)
          .end(function (normativaSaveErr, normativaSaveRes) {
            // Set message assertion
            (normativaSaveRes.body.message).should.match('Please fill Normativa name');

            // Handle Normativa save error
            done(normativaSaveErr);
          });
      });
  });

  it('should be able to update an Normativa if signed in', function (done) {
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

        // Save a new Normativa
        agent.post('/api/normativas')
          .send(normativa)
          .expect(200)
          .end(function (normativaSaveErr, normativaSaveRes) {
            // Handle Normativa save error
            if (normativaSaveErr) {
              return done(normativaSaveErr);
            }

            // Update Normativa name
            normativa.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Normativa
            agent.put('/api/normativas/' + normativaSaveRes.body._id)
              .send(normativa)
              .expect(200)
              .end(function (normativaUpdateErr, normativaUpdateRes) {
                // Handle Normativa update error
                if (normativaUpdateErr) {
                  return done(normativaUpdateErr);
                }

                // Set assertions
                (normativaUpdateRes.body._id).should.equal(normativaSaveRes.body._id);
                (normativaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Normativas if not signed in', function (done) {
    // Create new Normativa model instance
    var normativaObj = new Normativa(normativa);

    // Save the normativa
    normativaObj.save(function () {
      // Request Normativas
      request(app).get('/api/normativas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Normativa if not signed in', function (done) {
    // Create new Normativa model instance
    var normativaObj = new Normativa(normativa);

    // Save the Normativa
    normativaObj.save(function () {
      request(app).get('/api/normativas/' + normativaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', normativa.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Normativa with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/normativas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Normativa is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Normativa which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Normativa
    request(app).get('/api/normativas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Normativa with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Normativa if signed in', function (done) {
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

        // Save a new Normativa
        agent.post('/api/normativas')
          .send(normativa)
          .expect(200)
          .end(function (normativaSaveErr, normativaSaveRes) {
            // Handle Normativa save error
            if (normativaSaveErr) {
              return done(normativaSaveErr);
            }

            // Delete an existing Normativa
            agent.delete('/api/normativas/' + normativaSaveRes.body._id)
              .send(normativa)
              .expect(200)
              .end(function (normativaDeleteErr, normativaDeleteRes) {
                // Handle normativa error error
                if (normativaDeleteErr) {
                  return done(normativaDeleteErr);
                }

                // Set assertions
                (normativaDeleteRes.body._id).should.equal(normativaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Normativa if not signed in', function (done) {
    // Set Normativa user
    normativa.user = user;

    // Create new Normativa model instance
    var normativaObj = new Normativa(normativa);

    // Save the Normativa
    normativaObj.save(function () {
      // Try deleting Normativa
      request(app).delete('/api/normativas/' + normativaObj._id)
        .expect(403)
        .end(function (normativaDeleteErr, normativaDeleteRes) {
          // Set message assertion
          (normativaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Normativa error error
          done(normativaDeleteErr);
        });

    });
  });

  it('should be able to get a single Normativa that has an orphaned user reference', function (done) {
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

          // Save a new Normativa
          agent.post('/api/normativas')
            .send(normativa)
            .expect(200)
            .end(function (normativaSaveErr, normativaSaveRes) {
              // Handle Normativa save error
              if (normativaSaveErr) {
                return done(normativaSaveErr);
              }

              // Set assertions on new Normativa
              (normativaSaveRes.body.name).should.equal(normativa.name);
              should.exist(normativaSaveRes.body.user);
              should.equal(normativaSaveRes.body.user._id, orphanId);

              // force the Normativa to have an orphaned user reference
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

                    // Get the Normativa
                    agent.get('/api/normativas/' + normativaSaveRes.body._id)
                      .expect(200)
                      .end(function (normativaInfoErr, normativaInfoRes) {
                        // Handle Normativa error
                        if (normativaInfoErr) {
                          return done(normativaInfoErr);
                        }

                        // Set assertions
                        (normativaInfoRes.body._id).should.equal(normativaSaveRes.body._id);
                        (normativaInfoRes.body.name).should.equal(normativa.name);
                        should.equal(normativaInfoRes.body.user, undefined);

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
      Normativa.remove().exec(done);
    });
  });
});
