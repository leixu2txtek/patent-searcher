
export class RegisterAccountDto {

    /**
     * 姓名
     */
    name?: string;
    
    /**
     * 手机号
     */
    mobile?: string;

    /**
     * 邮箱
     */
    email?: string;

    /**
     * 加密密码
     */
    password?: string;

    /**
     * 验证码
     */
    code?: string;
}

export class LoginAccountDto {

    /**
     * 手机号/邮箱
     */
    username?: string;

    /**
     * 加密密码
     */
    password?: string;

    /**
     * 验证码
     */
    code?: string;
}