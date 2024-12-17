import { DATABASE_ID, MEMBERS_ID } from '@/config';
import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { Query } from 'node-appwrite';
import { z } from 'zod';
import { Member, MemberRole } from '../types';
import { getMember } from '../utils';

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get('databases');
      const user = c.get('user');
      const { workspaceId } = c.req.valid('query');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: 'Forbidden' }, 403);
      }

      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal('workspaceId', workspaceId)],
      );

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        }),
      );

      return c.json({ data: { ...members, documents: populatedMembers } });
    },
  )
  .delete('/:memberId', sessionMiddleware, async (c) => {
    const user = c.get('user');
    const databases = c.get('databases');
    const { memberId } = c.req.param();

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId,
    );

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('workspaceId', memberToDelete.workspaceId),
    ]);

    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    if (members.total === 1) {
      return c.json({ error: 'Cannot remove last member' }, 400);
    }

    if (memberToDelete.role === MemberRole.ADMIN) {
      const admins = members.documents.filter(
        (m) => m.role === MemberRole.ADMIN && m.$id !== memberToDelete.$id,
      );

      if (admins.length === 0) {
        return c.json(
          { error: 'Cannot remove last admin from workspace' },
          400,
        );
      }
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({ data: { $id: memberId } });
  })
  .patch(
    '/:memberId',
    sessionMiddleware,
    zValidator('json', z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const user = c.get('user');
      const databases = c.get('databases');
      const { memberId } = c.req.param();
      const { role } = c.req.valid('json');

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId,
      );

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal('workspaceId', memberToUpdate.workspaceId),
      ]);

      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: 'Forbidden' }, 403);
      }

      if (member.role !== MemberRole.ADMIN) {
        return c.json({ error: 'Forbidden' }, 403);
      }

      if (
        memberToUpdate.role === MemberRole.ADMIN &&
        role === MemberRole.MEMBER
      ) {
        const admins = members.documents.filter(
          (m) => m.role === MemberRole.ADMIN && m.$id !== memberToUpdate.$id,
        );

        if (admins.length === 0) {
          return c.json(
            { error: 'Cannot downgrade last admin to member' },
            400,
          );
        }
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({ data: { $id: memberId } });
    },
  );

export default app;