var ASAuthorizationControllerDelegateImpl_1;
import { Device, Utils } from "@nativescript/core";
let controller;
let delegate;
export function isSignInWithAppleSupported() {
    return parseInt(Device.osVersion) >= 13;
}
export function getSignInWithAppleState(user) {
    return new Promise((resolve, reject) => {
        if (!user) {
            reject("The 'user' parameter is mandatory");
            return;
        }
        if (!isSignInWithAppleSupported()) {
            reject("Not supported");
            return;
        }
        const provider = ASAuthorizationAppleIDProvider.new();
        provider.getCredentialStateForUserIDCompletion(user, (state, error) => {
            if (error) {
                reject(error.localizedDescription);
                return;
            }
            if (state === 1) {
                resolve("AUTHORIZED");
            }
            else if (state === 2) {
                resolve("NOTFOUND");
            }
            else if (state === 3) {
                resolve("REVOKED");
            }
            else {
                reject("Invalid state for getSignInWithAppleState: " +
                    state +
                    ", please report an issue at he plugin repo!");
            }
        });
    });
}
export function signInWithApple(options) {
    return new Promise((resolve, reject) => {
        if (!isSignInWithAppleSupported()) {
            reject("Not supported");
            return;
        }
        const provider = ASAuthorizationAppleIDProvider.new();
        const request = provider.createRequest();
        if (options && options.user) {
            request.user = options.user;
        }
        if (options && options.scopes) {
            const nsArray = NSMutableArray.new();
            options.scopes.forEach(s => {
                if (s === "EMAIL") {
                    nsArray.addObject(ASAuthorizationScopeEmail);
                }
                else if (s === "FULLNAME") {
                    nsArray.addObject(ASAuthorizationScopeFullName);
                }
                else {
                    console.log("Unsupported scope: " + s + ", use either EMAIL or FULLNAME");
                }
            });
            request.requestedScopes = nsArray;
        }
        controller = ASAuthorizationController.alloc().initWithAuthorizationRequests(Utils.ios.collections.jsArrayToNSArray([request]));
        controller.delegate = delegate = ASAuthorizationControllerDelegateImpl.createWithPromise(resolve, reject);
        controller.performRequests();
    });
}
let ASAuthorizationControllerDelegateImpl = ASAuthorizationControllerDelegateImpl_1 = class ASAuthorizationControllerDelegateImpl extends NSObject {
    static new() {
        try {
            ASAuthorizationControllerDelegateImpl_1.ObjCProtocols.push(ASAuthorizationControllerDelegate);
            return super.new();
        }
        catch (ignore) {
            console.log("Apple Sign In not supported on this device - it requires iOS 13+. Tip: use 'isSignInWithAppleSupported' before calling 'signInWithApple'.");
            return null;
        }
    }
    static createWithPromise(resolve, reject) {
        const delegate = (ASAuthorizationControllerDelegateImpl_1.new());
        if (delegate === null) {
            reject("Not supported");
        }
        else {
            delegate.resolve = resolve;
            delegate.reject = reject;
        }
        return delegate;
    }
    authorizationControllerDidCompleteWithAuthorization(controller, authorization) {
        if (authorization && authorization.credential) {
            const data = {
                provider: authorization.provider,
                credential: {
                    email: authorization.credential.email,
                    fullName: authorization.credential.fullName,
                    realUserStatus: authorization.credential.realUserStatus,
                    state: authorization.credential.state,
                    user: authorization.credential.user,
                    password: authorization.credential.password
                }
            };
            if (authorization.credential.accessToken) {
                data.credential.accessToken = NSString.alloc()
                    .initWithDataEncoding(authorization.credential.accessToken, NSUTF8StringEncoding)
                    .toString();
            }
            if (authorization.credential.authorizationCode) {
                data.credential.authorizationCode = NSString.alloc()
                    .initWithDataEncoding(authorization.credential.authorizationCode, NSUTF8StringEncoding)
                    .toString();
            }
            if (authorization.credential.authorizedScopes) {
                data.credential.authorizedScopes = Utils.ios.collections.nsArrayToJSArray(authorization.credential.authorizedScopes);
            }
            if (authorization.credential.identityToken) {
                data.credential.identityToken = NSString.alloc()
                    .initWithDataEncoding(authorization.credential.identityToken, NSUTF8StringEncoding)
                    .toString();
            }
            this.resolve(data);
        }
        else {
            this.reject("auth error: no credential returned.");
        }
    }
    authorizationControllerDidCompleteWithError(controller, error) {
        this.reject(error.localizedDescription);
    }
};
ASAuthorizationControllerDelegateImpl.ObjCProtocols = [];
ASAuthorizationControllerDelegateImpl = ASAuthorizationControllerDelegateImpl_1 = __decorate([
    NativeClass()
], ASAuthorizationControllerDelegateImpl);
//# sourceMappingURL=apple-sign-in.ios.js.map