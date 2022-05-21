import {RoleModel, UserModel} from "../models";

export class AdminService {

    private static instance?: AdminService;

    public static getInstance(): AdminService {
        if (AdminService.instance === undefined) {
            AdminService.instance = new AdminService();
        }
        return AdminService.instance;
    }

    private constructor() {
    }

    async setRoleAdmin(id: string) {
        let user = await UserModel.findOne({name: id}).exec();
        if(user){
            let actualRole = await RoleModel.findOne({_id: user.role}).exec();
            if(!actualRole || actualRole.role !== "coocker"){
                throw new Error("User cant be admin");
            }
        }else{
            throw new Error("User not found");
        }
        let role = await RoleModel.findOne({name: "admin"});
        if (role) {
            user.role = role._id;
        } else {
            throw new Error("Role not found");
        }

        return await user.save();
    }

}
