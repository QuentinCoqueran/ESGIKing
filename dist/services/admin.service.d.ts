/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose" />
export declare class AdminService {
    private static instance?;
    static getInstance(): AdminService;
    private constructor();
    setRoleAdmin(id: string): Promise<import("../models").UserProps & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
}
