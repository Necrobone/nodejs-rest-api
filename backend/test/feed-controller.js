const expect = require("chai").expect;
const mongoose = require("mongoose");
const sinon = require("sinon");

const io = require("../socket");
const User = require("../models/user");
const FeedController = require("../controllers/feed");

describe("Feed controller", () => {
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

  it("should add a created post to the posts of the creator", (done) => {
    const request = {
      body: {
        title: "Test Post",
        content: "A Test Post",
      },
      file: {
        path: "pathToImg",
      },
      userId: "5c0f66b979af55031b34728a",
    };

    const response = {
      status: function() {
        return this;
      },
      json: function() {}
    };

    const stub = sinon.stub(io, "getIO").callsFake(() => {
      return {
        emit: function () {},
      };
    });

    FeedController.createPost(request, response, () => {})
      .then((user) => {
        expect(user).to.have.property("posts");
        expect(user.posts).to.have.length(1);
        stub.restore();
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
