'use server'
import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { AuthCredentials } from "@/types";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "../config";


export const signInWithCredentials = async (param: Pick<AuthCredentials, "email" | "password">) => {

    const { email, password } = param
    const ip = (await headers()).get('x-forwarded-for') || "127.0.0.1"

    const { success } = await ratelimit.limit(ip)

    if (!success) return redirect("/too-fast")

    try {
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false
        })

        if (result?.error) {
            return { success: false, error: result.error }
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: "SignIn Error!" }
    }

}

export const signUp = async (param: AuthCredentials) => {
    const { fullName, email, password, universityId,
        universityCard
    } = param

    const ip = (await headers()).get('x-forwarded-for') || "127.0.0.1"

    const { success } = await ratelimit.limit(ip)

    if (!success) return redirect("/too-fast")

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (existingUser.length > 0) {
        return { success: false, error: "User already existed" }
    }

    const hashedPassword = await hash(password, 10)

    try {
        await db.insert(users).values({
            full_name: fullName,
            email,
            password: hashedPassword,
            universityCard,
            universityId
        })

        await workflowClient.trigger({
            url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
            body: {
                email,
                fullName
            }
        })

        await signInWithCredentials({ email, password })
        return { success: true }
    } catch (error) {
        return { success: false, error: "SignUp Error!" }
    }
}