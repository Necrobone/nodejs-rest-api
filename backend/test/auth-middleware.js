const expect = require('chai').expect;

const authMiddleware = require('../middlewares/is-auth');

describe('Auth middleware', () => {
    it('should throw an error if no authorization header is present', () => {
        const request = {
            get: () => null
        };

        expect(authMiddleware.bind(this, request, {}, () => {})).to.throw('Not authenticated');
    });

    it('should throw an error if the authorization header is only one string', () => {
        const request = {
            get: () => 'xyz'
        };

        expect(authMiddleware.bind(this, request, {}, () => {})).to.throw('jwt must be provided');
    });

})
