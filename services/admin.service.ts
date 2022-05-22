import {RestaurantModel, RoleModel, UserModel} from "../models";
import {AuthService} from "./auth.service";

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
        let user = await UserModel.findById(id);
        if(user){
            let actualRole = await AuthService.getInstance().getRoleFrom(user._id);
            if(!actualRole || actualRole !== "cooker"){
                throw new Error("User cant be admin");
            }
        }else{
            throw new Error("User not found");
        }
        let role = await RoleModel.findOne({role: "admin"});
        if (role) {
            user.role = role._id;
        } else {
            role = await RoleModel.create({
                role: "admin",
            });
            user.role = role._id;
        }

        return await user.save();
    }

    async deleteAdmin(id: string) {

        let admin = await UserModel.findById(id);
        if(admin){
            let actualRole = await AuthService.getInstance().getRoleFrom(admin._id);
            if(!actualRole || actualRole !== "admin"){
                throw new Error("User is not admin");
            }else{
                const res = await UserModel.deleteOne({_id: id}).exec();
                return res.deletedCount === 1;
            }
        }

        return false;

    }

}
