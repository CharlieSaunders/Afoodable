export class CreateResponse{
    public acknowledged: boolean;
    public insertedId: any;
    constructor(_ack: boolean, _id: any){
        this.acknowledged = _ack;
        this.insertedId = _id;
    }
}

export class DeletedResponse{
    public acknowledged: boolean;
    public deletedId: any;
    constructor(_ack: boolean, _deletedId: any){
        this.acknowledged = _ack;
        this.deletedId = _deletedId;
    }
}

export class UpdateResponse{
    public acknowledged: boolean;
    public matchedCount: any;
    public modifiedCount: any;
    public upsertedCount: any;
    public upsertedId: any;
    constructor(_ack: boolean, _matched: any, _modifiedCount: any, _upsertedCount: any, _upsertId: any){
        this.acknowledged = _ack;
        this.matchedCount = _matched;
        this.modifiedCount = _modifiedCount;
        this.upsertedCount = _upsertedCount;
        this.upsertedId = _upsertId;
    }
}

// Mappers
export class ApiResponseMapper{
    public static mapCreate(result:any){
        return new CreateResponse(result.acknowledged, result.insertedId);
    }

    public static mapDelete(result:any): DeletedResponse {
        return new DeletedResponse(result.acknowledged, result.deletedId);
    }

    public static mapUpdate(result: any): UpdateResponse{
        return new UpdateResponse(result.acknowledged, result.matchedCount, result.modifiedNumber, result.upsertedCount, result.upsertedId);
    }
}
