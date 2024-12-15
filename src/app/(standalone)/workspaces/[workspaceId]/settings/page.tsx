import { getCurrent } from '@/features/auth/actions';
import { getWorkspace } from '@/features/workspaces/actions';
import { EditWorkspaceForm } from '@/features/workspaces/components/update-workspace-form';
import { redirect } from 'next/navigation';

interface WorkspaceSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceSettingsPage = async ({
  params,
}: WorkspaceSettingsPageProps) => {
  const user = await getCurrent();
  if (!user) redirect('/sign-in');

  const initialData = await getWorkspace({ workspaceId: params.workspaceId });

  if (!initialData) redirect(`/workspaces/${params.workspaceId}`);

  return (
    <div className='w-full lg:max-w-xl'>
      <EditWorkspaceForm initialData={initialData} />
    </div>
  );
};

export default WorkspaceSettingsPage;
