const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth controller", () => {
  before((done) => {
    mongoose
      .connect(
        "mongodb+srv://root:wUkLd5QqMMX7vQgQ@shop.bcjtd.mongodb.net/test-feeds"
      )
      .then((result) => {
        const user = new User({
          email: "test@test.com",
          password: "tester",
          name: "Test",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });
        return user.save();
      })
      .then(() => {
        done();
      })
      .catch((error) => console.log(error));
  });

  beforeEach(function () {});

  afterEach(function () {});

  it("should throw a 500 error if accessing the database fails", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const request = {
      body: {
        email: "test@test.com",
        password: "tester",
      },
    };

    AuthController.login(request, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });

  it("should send a response with a valid user status for an existing user", (done) => {
    const request = { userId: "5c0f66b979af55031b34728a" };
    const response = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    AuthController.getStatus(request, response, () => {})
      .then(() => {
        expect(response.statusCode).to.be.equal(200);
        expect(response.userStatus).to.be.equal("I am new!");
        done();
      })
      .catch((error) => console.log(error));
  });

  after((done) => {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      })
      .catch((error) => console.log(error));
  });
});
