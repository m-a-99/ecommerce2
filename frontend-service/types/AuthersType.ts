import { SocialMediaPlatformProfile } from "./ManufacturersType";

export type AutherType = { _id: string; Image: string; Name: string; Languages: string; Bio: string; Quote: string; Born: string; Death: string; SocialProfiles:SocialMediaPlatformProfile[] };
export type AuthersType = AutherType[];
