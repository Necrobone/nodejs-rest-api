const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const authMiddleware = require("../middlewares/is-auth");

describe("Auth middleware", () => {
  it("should throw an error if no authorization header is present", () => {
    const request = {
      get: () => null,
    };

    expect(authMiddleware.bind(this, request, {}, () => {})).to.throw(
      "Not authenticated"
    );
  });

  it("should throw an error if the authorization header is only one string", () => {
    const request = {
      get: () => "xyz",
    };

    expect(authMiddleware.bind(this, request, {}, () => {})).to.throw(
      "jwt must be provided"
    );
  });

  it("should throw an error if the token cannot be verified", () => {
    const request = {
      get: () => "Bearer xyz",
    };

    expect(authMiddleware.bind(this, request, {}, () => {})).to.throw();
  });

  it("should throw an error if the token cannot be verified", () => {
    const request = {
      get: () => "Bearer xyz",
    };

    sinon.stub(jwt, "verify");

    jwt.verify.returns({
      userId: "abc",
    });

    authMiddleware(request, {}, () => {});

    expect(request).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;

    jwt.verify.restore();
  });
});
