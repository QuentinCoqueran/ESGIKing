"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const models_1 = require("../models");
class AdminService {
    static instance;
    static getInstance() {
        if (AdminService.instance === undefined) {
            AdminService.instance = new AdminService();
        }
        return AdminService.instance;
    }
    constructor() {
    }
    async setRoleAdmin(id) {
        let user = await models_1.UserModel.findOne({ name: id }).exec();
        if (user) {
            let actualRole = await models_1.RoleModel.findOne({ _id: user.role }).exec();
            if (!actualRole || actualRole.role !== "coocker") {
                throw new Error("User cant be admin");
            }
        }
        else {
            throw new Error("User not found");
        }
        let role = await models_1.RoleModel.findOne({ name: "admin" });
        if (role) {
            user.role = role._id;
        }
        else {
            throw new Error("Role not found");
        }
        return await user.save();
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map