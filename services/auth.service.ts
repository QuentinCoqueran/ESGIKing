import {ProductModel, RoleDocument, RoleModel, RoleProps, UserDocument, UserModel, UserProps} from "../models";
import {SecurityUtils} from "../utils";
import {SessionDocument, SessionModel} from "../models";
import {Session} from "inspector";
import {userInfo} from "os";


export class AuthService {

    private static instance?: AuthService;

    public static getInstance(): AuthService {
        if (AuthService.instance === undefined) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private constructor() {
    }

    public async subscribeUser(user: Partial<UserProps>, info: Pick<RoleProps, 'role'>, platform: string): Promise<RoleDocument | null> {
        if(info.role != "admin" && info.role != "bigboss" && info.role != "customer" && info.role != "cooker" && info.role != "deliveryman"){
            throw new Error("Role not found");
        }
        if (!user.password) {
            throw new Error('Missing password');
        }
        if (info.role === "admin" || info.role === "cooker" || info.role === "bigboss"){
            throw new Error('You cant create this account type');
        }
        const model = await UserModel.create({
            login: user.login,
            password: SecurityUtils.sha512(user.password),
            name: user.name,
            lastname: user.lastname
        });
        let role: RoleDocument | null;
        const isExists = await RoleModel.exists({role: info.role});
        if (!isExists) {
            role = await RoleModel.create({
                platform,
                role: info.role
            });
        } else {
            role = await RoleModel.findOne({role: info.role});

        }
        model.role = role?._id
        //update de model
        await model.save();
        return role;
    }

    // Pick selectionne des champs dans le type
    public async logIn(info: Pick<UserProps, 'login' | 'password'>, platform: string): Promise<SessionDocument | null> {
        const user = await UserModel.findOne({
            login: info.login,
            password: SecurityUtils.sha512(info.password)
        }).exec();
        if (user === null) {
            throw new Error('User not found');
        }
        // 604_800 -> 1 week in seconds
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + 604_800_000);
        const session = await SessionModel.create({
            platform,
            expiration: expirationDate,
            user: user._id
        });
        user.sessions.push(session._id); // permet de memoriser la session dans le user
        await user.save();
        return session;
    }

    public async getUserFrom(token: string): Promise<UserProps | null> {
        const session = await SessionModel.findOne({
            _id: token,
            expiration: {
                $gte: new Date()
            }
        }).populate("user").exec();

        return session ? session.user as UserProps : null;
    }

    public async getRoleFrom(userId: string | undefined): Promise<string | null> {
        const actualUser = await UserModel.findOne({
            _id: userId,
        });

        if (actualUser) {
            const actualRole = await RoleModel.findOne({
                _id: actualUser.role,
            });
            if (actualRole) {
                console.log(actualRole.role)
                return actualRole.role;
            }
        }
        return null
    }

}


