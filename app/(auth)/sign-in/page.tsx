"use client";
import AuthForm from "@/components/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth";
import { signInSchema } from "@/lib/validation";
import React from "react";

const SignInPage = () => {
    return (
        <div>
            <AuthForm
                type="SIGN_IN"
                schema={signInSchema}
                defaultValues={{ email: "", password: "" }}
                onSubmit={signInWithCredentials}
            />
        </div>
    );
};

export default SignInPage;
