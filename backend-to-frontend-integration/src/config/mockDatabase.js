// In-memory mock database for development/sandbox mode
// This allows the API to run without MongoDB for testing and demonstration

class MockDatabase {
  constructor() {
    this.collections = {};
  }

  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new MockCollection(name);
    }
    return this.collections[name];
  }

  async connect() {
    console.log('[MockDB] Connected in-memory mock database');
    return this;
  }

  async close() {
    this.collections = {};
  }
}

class MockCollection {
  constructor(name) {
    this.name = name;
    this.data = [];
    this.idCounter = 1;
  }

  async insertOne(doc) {
    const id = this.idCounter++;
    const result = { ...doc, _id: id };
    this.data.push(result);
    return { insertedId: id, ops: [result] };
  }

  async insertMany(docs) {
    const results = docs.map(doc => ({
      ...doc,
      _id: this.idCounter++,
    }));
    this.data.push(...results);
    return { insertedIds: results.map(r => r._id), ops: results };
  }

  async find(query = {}) {
    const filtered = this.data.filter(item =>
      Object.entries(query).every(([key, value]) => item[key] === value)
    );
    return {
      toArray: async () => filtered,
      limit: (n) => ({ toArray: async () => filtered.slice(0, n) }),
      skip: (n) => ({ toArray: async () => filtered.slice(n) }),
    };
  }

  async findOne(query = {}) {
    return this.data.find(item =>
      Object.entries(query).every(([key, value]) => item[key] === value)
    ) || null;
  }

  async updateOne(query, update) {
    const item = await this.findOne(query);
    if (item) {
      Object.assign(item, update.$set || update);
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  async deleteOne(query) {
    const index = this.data.findIndex(item =>
      Object.entries(query).every(([key, value]) => item[key] === value)
    );
    if (index > -1) {
      this.data.splice(index, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async countDocuments(query = {}) {
    return (await this.find(query).toArray()).length;
  }
}

export default new MockDatabase();
