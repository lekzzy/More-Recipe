process.env.NODE_ENV = 'test';
import recipes from '../models/recipe';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../api/app';

const { expect } = chai;


chai.use(chaiHttp);
//Our parent block
describe('Get empty API', () => {

    describe('GET /api/', () => {

      // Test for index route
      it('Should return 404', (done) => {
        chai.request(app)
          .get('/')
          .end((err, res) => {
            expect(res).to.have.status(404);
            done();
          });
      });
    
      it('Undefined Routes Should Return 404', (done) => {
        chai.request(app)
          .post('/another/undefined/route')
          .send({ random: 'random' })
          .end((err, res) => {
            expect(res).to.have.status(404);
            done();
          });
      });
    
    });

    describe('Get all recipes API', () => {

    describe('GET /api/recipes', () => {
        it('it should GET all the recipes', (done) => {
          chai.request(app)
              .get('/api/recipes')
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).be.eql({recipes});
                  
                done();
              });
        });
    });

    });

    });

    describe('Put values in recipes API', () => {
        
            describe('PUT /api/recipes', () => {
                it('it should put the values in the recipes id specified', (done) => {
                   let recipeDetail = { name: 'Amala', description: 'Best serve hot' };
                  chai.request(app)
                      .put('/api/recipes/3')
                      .send(recipeDetail)
                      .end((err, res) => {
                       expect(res).to.have.status(200);
                       expect(res.body).to.be.a('object');
                       expect(res.body).to.have.property('message').to.deep.eql('Recipe successfully updated!');
                      
                     done();
                   });
                     
                        
                      });
                });
            });
        
        describe('Post a recipes in the API', () => {
            describe('/POST recipes', () => {
                it('it should not POST without user field', (done) => {
                  let position = recipes +1;
                  let recipes = {
                    id: position,
                    name: 'Efo Riro',
                    description: 'The delicious soup for all swallows',
                    imageUrl: "image/amala_efo.jpg",
                    downvotes: 23,
                    favorited: 17,
                    views: 234,
                    review:['This food is so sweet','easy to cook' ]
                  }
                      chai.request(app)
                      .post('/api/recipes/'+ position)
                      .send(recipes)
                      .end((err, res) => {
                        expect(res).to.have.status(200);
                          expect(res.body).to.be.a('object');
                          expect(res.body).not.to.have.property('user');
                          expect(res.body).not.to.have.property('upvotes');
                        done();
                      });
                });
            });
        });

        describe('Delete a recipes in the API', () => {
        describe('/DELETE/:id recipe', () => {
          it('it should DELETE a recipe given the id', (done) => {
                    chai.request(app)
                    .delete('/api/recipes/4')
                    .end((err, res) => {
                      expect(res).to.have.status(200);
                      expect(res.body).to.be.a('object');
                      expect(res.body).to.have.property('message').eql('Recipe Deleted Successfully');

                      done();
                    });
              });
          });
        });