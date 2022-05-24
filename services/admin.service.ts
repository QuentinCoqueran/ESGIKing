import {RestaurantModel, RoleModel, UserDocument, UserModel, UserProps} from "../models";
import {AuthService} from "./auth.service";
import {SecurityUtils} from "../utils";

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

    async createAdmin(user: Partial<UserProps>): Promise<UserDocument | null> {
        let role = await RoleModel.findOne({role: "admin"});
        if (role) {

            if (!user.password) {
                throw new Error('Missing password');
            }

            let newUser = await UserModel.create({
                login: user.login,
                password: SecurityUtils.sha512(user.password),
                name: user.name,
                lastname: user.lastname
            });

            newUser.role = role._id;


            return await newUser.save();

        } else {
            throw new Error("Admin role not found");
        }
    }

    async getAllAdmins() {
        let role = await RoleModel.findOne({role: "admin"});
        if (role) {
            return UserModel.find({role: role._id});
        } else {
            throw new Error("Admin role not found");
        }
    }
}
