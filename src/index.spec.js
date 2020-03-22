const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { expect } = require('chai');
const faker = require('faker');
const searchPlugin = require('./index');

const dogSchema = new mongoose.Schema({ name: String, age: Number, isHomeless: Boolean });
dogSchema.plugin(searchPlugin);

const Dog = mongoose.model('Dog', dogSchema);

describe('Test', () => {

  let hulk;

  before(async() => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27018/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    hulk = await Dog.create({ name: 'Hulk', age: 5, isHomeless: false });

    await Dog.create(Array(100).fill(null).map(() => ({
      name: faker.name.findName(),
      age: faker.random.number(15),
      isHomeless: faker.random.boolean()
    })));
  });

  after(async() => {
    await mongoose.connection.collections.dogs.drop();
    hulk = null;
  });

  it('Should get first page and generate meta data', async() => {
    const dogs = await Dog.search({}, { page: 1, limit: 10 });
    expect(dogs).has.property('data').lengthOf(10);
    expect(dogs).has.property('meta');
  });

  it('Should not get Hulk from the collection', async() => {
    const dogs = await Dog.search({ _id: hulk._id.toString(), age: 5, isHomeless: false });
    expect(dogs).has.property('data').lengthOf(0);
  });

  it('Should convert types and get Hulk from the collection', async() => {
    const dogs = await Dog.search({ _id: hulk._id.toString(), age: '5', isHomeless: 'false' }, { convertTypes: true });
    expect(dogs).has.property('data').lengthOf(1);
  });

  it('Should search Hulk by name', async() => {
    const dogs = await Dog.search({ name: 'Hulk' }, { fields: ['name'] });
    expect(dogs).has.property('data').lengthOf(1);
  });
});