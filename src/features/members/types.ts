import { Models } from 'node-appwrite';

export type Member = Models.Document & {
  userId: string;
  workspaceId: string;
  role: MemberRole;
};

export enum MemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}
