const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');

describe('HTTP Request Handling', function(){
    it('When a GET request is made to `/`, app responds with an html file', function(done){
        request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200)
            .end(done);
    })
})