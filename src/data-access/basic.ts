export class BasicDataAccess<T = any> {
    private model: any;

    constructor(model: any) {
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    async findById(id: string, data?: any, options?: Record<string, any>): Promise<T | null> {
        return await this.model.findById(id, data, options);
    }

    async findOne(filter: Partial<T>, data?: any, options?: Record<string, any>): Promise<T | null> {
        return await this.model.findOne(filter, data, options);
    }

    async find(filter: Partial<T> = {}, data?: any, options: Record<string, any> = {}): Promise<T[]> {
        return await this.model.find(filter, data, options);
    }

    async updateById(id: string, data: Partial<T>, options: Record<string, any> = { new: true }): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, data, options);
    }

    async findOneAndUpdate(
        filter: Partial<T>,
        data: Partial<T>,
        options: Record<string, any> = { new: true }
    ): Promise<T | null> {
        return await this.model.findOneAndUpdate(filter, data, options);
    }

    async deleteById(id: string): Promise<T | null> {
        return await this.model.findByIdAndDelete(id);
    }

    async deleteMany(filter: Partial<T>, options?: Record<string, any>): Promise<{ deletedCount?: number }> {
        return await this.model.deleteMany(filter, options);
    }

    async count(filter: Partial<T> = {}, options?: Record<string, any>): Promise<number> {
        return await this.model.countDocuments(filter, options);
    }
}