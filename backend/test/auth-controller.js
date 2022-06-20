const expect = require("chai").expect;
const sinon = require("sinon");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth controller", () => {
  describe('Login', () => {
    it("should throw a 500 error if accessing the database fails", (done) => {
      sinon.stub(User, "findOne");
      User.findOne.throws();

      const request = {
        body: {
          email: 'test@test.com',
          password: 'tester'
        }
      };

      AuthController.login(request, {}, () => {}).then(result => {
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 500);
        done();
      });

      User.findOne.restore();
    });
  });
});
