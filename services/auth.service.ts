import {RoleDocument, RoleModel, RoleProps, UserDocument, UserModel, UserProps} from "../models";
import {SecurityUtils} from "../utils";
import {SessionDocument, SessionModel} from "../models/session.model";
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

    public async subscribeUser(user: Partial<UserProps>, info: Pick<RoleProps, 'role'>, platform: string): Promise<RoleDocument> {
        if (!user.password) {
            throw new Error('Missing password');
        }
        const model = await UserModel.create({
            login: user.login,
            password: SecurityUtils.sha512(user.password),
            name: user.name,
            lastname: user.lastname
        });

        const role = await RoleModel.create({
            platform,
            user: model?._id,
            role: info.role
        });

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

    public async getRoleFrom(userId: string | undefined): Promise<string | undefined> {
        const roleActual = await RoleModel.findOne({
            user: userId,
        }).populate("user").exec();
        return roleActual?.role
    }

}
