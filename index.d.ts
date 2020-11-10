export declare type SignInWithAppleScope = "EMAIL" | "FULLNAME";
export declare type SignInWithAppleState = "AUTHORIZED" | "NOTFOUND" | "REVOKED";
export declare interface SignInWithAppleOptions {
    user?: string;
    scopes?: Array<SignInWithAppleScope>;
}
export declare const enum SignInWithAppleUserDetectionStatus {
    Unsupported = 0,
    Unknown = 1,
    LikelyReal = 2
}
export declare interface SignInWithAppleName {
    familyName?: string;
    givenName?: string;
    middleName?: string;
    namePrefix?: string;
    nameSuffix?: string;
    nickname?: string;
    phoneticRepresentation?: SignInWithAppleName;
}
export interface SignInWithAppleCredential {
    accessToken?: string;
    authenticatedResponse?: any;
    authorizationCode?: string;
    authorizedScopes?: Array<string>;
    email?: string;
    fullName?: SignInWithAppleName;
    identityToken?: string;
    realUserStatus?: SignInWithAppleUserDetectionStatus;
    state?: string;
    user?: string;
    password?: string;
}
export interface SignInWithAppleAuthorization {
    credential: SignInWithAppleCredential;
    provider: any;
}
export declare function isSignInWithAppleSupported(): boolean;
export declare function getSignInWithAppleState(user: string): Promise<SignInWithAppleState>;
export declare function signInWithApple(options?: SignInWithAppleOptions): Promise<SignInWithAppleAuthorization>;
