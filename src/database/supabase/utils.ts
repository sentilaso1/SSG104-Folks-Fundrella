import { supabase } from "./client";
import type { TablesInsert } from "../database.types";
import { UndefinedUserIdError, type UserId } from "../models";

export async function getUserId() {
    const { data } = await supabase.auth.getUser();

    if (!data || !data.user || !data.user.id) {
        return undefined;
    }
    return data.user?.id;
}

export async function getAccount(userId: UserId) {
    if (!userId) {
        return { data: [], error: UndefinedUserIdError(userId) }
    }
    return await supabase.from("Account").select().eq('user_id', userId);
}

export async function getPreferences(userId: UserId) {
    if (!userId) {
        return { data: [], error: UndefinedUserIdError(userId) }
    }
    return await supabase.from("Preferences").select().eq('user_id', userId);
}

export async function getCategory(userId: UserId) {
    if (!userId) {
        return { data: [], error: UndefinedUserIdError(userId) }
    }
    return await supabase.from("Category").select().eq('user_id', userId);
}

export async function getGoal(userId: UserId) {
    if (!userId) {
        return { data: [], error: UndefinedUserIdError(userId) }
    }
    return await supabase.from("Goal").select().eq('user_id', userId);
}

export async function getTransaction() {
    return await supabase.from("Transaction").select();
}

export async function createAccount(account: TablesInsert<"Account">) {
    if (!account.user_id) {
        return { data: [], error: UndefinedUserIdError(account.user_id) };
    }

    if (!account.balance || account.balance < 0) {
        account.balance = 0;
    }
    account.is_saving = account.is_saving ?? false;

    return await supabase.from("Account").insert(account).select();
}