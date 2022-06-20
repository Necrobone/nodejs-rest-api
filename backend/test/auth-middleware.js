const expect = require('chai').expect;

const authMiddleware = require('../middlewares/is-auth');

it('should throw an error if no authorization header is present', () => {
   const request = {
       get: () => null
   };

   expect(authMiddleware.bind(this, request, {}, () => {})).to.throw('Not authenticated');
});
