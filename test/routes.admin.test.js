//接口单元测试

'use strict';
const superagent = require('supertest');
const app = require('../app');
const request = superagent(app.listen());

describe('Routes', () => {
    describe('GET /', () => {
        it('should return 404', done => {
            request
                .get('/')
                .expect(404, done);
        });
    });
    describe('GET /test', () => {
        it('should return 200', done => {
            request
                .get('/test')
                .expect(200, done);
        });
    });
    describe('GET /hooks/all', () => {
        it('should return 200', done => {
            request
                .get('/hooks/all')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});