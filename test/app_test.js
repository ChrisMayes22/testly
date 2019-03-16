const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');

describe('HTTP Request Handling', function(){
    describe('When a GET request is made' , function(){
        it('Given user is not authenticated, app responds with index.ejs', function(done){
            request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200)
                .end(done);
        });
    });
    it('When a GET request is made from non-authorized user to `/auth/google`, app redirects to Google sign in', function(done){
        request(app)
            .get('/auth/google')
            .expect(302)
            .expect(res => {
                expect(res.headers.location.match(/https:\/\/accounts.google.com/)[0]).to.exist;
            })
            .end(done);
    });
})