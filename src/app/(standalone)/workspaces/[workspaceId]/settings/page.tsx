import { EditWorkspaceForm } from '@/features/workspaces/components/edit-workspace-form';
import { getWorkspace } from '@/features/workspaces/queries';
import { redirect } from 'next/navigation';

interface WorkspaceSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceSettingsPage = async ({
  params,
}: WorkspaceSettingsPageProps) => {
  const workspace = await getWorkspace({ workspaceId: params.workspaceId });
  if (!workspace) redirect(`/workspaces/${params.workspaceId}`);

  return (
    <div className='w-full lg:max-w-xl'>
      <EditWorkspaceForm workspace={workspace} />
    </div>
  );
};

export default WorkspaceSettingsPage;
