import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';
import { getWorkspaceInfo } from '@/features/workspaces/queries';
import { redirect } from 'next/navigation';

interface WorkspaceJoinPageProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

const WorkspaceJoinPage = async ({ params }: WorkspaceJoinPageProps) => {
  const workspace = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
  });

  if (!workspace) redirect('/');

  return (
    <div className='w-full lg:max-w-xl'>
      <JoinWorkspaceForm
        initialValues={workspace}
        code={params.inviteCode}
        workspaceId={params.workspaceId}
      />
    </div>
  );
};

export default WorkspaceJoinPage;
