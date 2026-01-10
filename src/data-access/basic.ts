export class BasicDataAccess {
    private model: any;

    constructor(model: any) {
        this.model = model;
    }

    async create(data: any) {
        return await this.model.create(data);
    }

    async findById(id: string, data?: any, options?: any) {
        return await this.model.findOne({ id }, data, options);
    }

    async findOne(filter: any, data?: any, options?: any) {
        return await this.model.findOne(filter, data, options);
    }

    async find(filter: any = {}, data?: any, options: any = {}) {
        return await this.model.find(filter, data, options);
    }

    async updateById(id: string, data: any, options: any = { new: true }) {
        return await this.model.findOneAndUpdate({ id }, data, options);
    }

    async findOneAndUpdate(
        filter: any,
        data: any,
        options: any = { new: true }
    ) {
        return await this.model.findOneAndUpdate(filter, data, options);
    }

    async deleteById(id: string) {
        return await this.model.findOneAndDelete({ id });
    }

    async deleteMany(filter: any, options?: any) {
        return await this.model.deleteMany(filter, options);
    }

    async count(filter: any = {}, options?: any) {
        return await this.model.countDocuments(filter, options);
    }
}