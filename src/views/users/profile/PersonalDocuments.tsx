import { pick } from 'lodash';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';

import Permission from '../../../components/Atoms/auth/Permission';
import Button from '../../../components/Atoms/custom/Button';
import Loader from '../../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../../components/Molecules/cards/NoDataAvailable';
import Table from '../../../components/Molecules/table/Table';
import useAuthenticator from '../../../hooks/useAuthenticator';
import { queryClient } from '../../../plugins/react-query';
import usersStore from '../../../store/administration/users.store';
import { Privileges } from '../../../types';
import { IEvaluationInfo } from '../../../types/services/evaluation.types';
import { EvaluationStudent } from '../../../types/services/marking.types';
import { ModuleAttachment } from '../../../types/services/module-material.types';
import { UserInfo } from '../../../types/services/user.types';
import { downloadPersonalDoc } from '../../../utils/file-util';

export default function PersonalDocuments({ user }: { user: UserInfo }) {
  const [attachments, setAttachments] = useState([]);
  const { user: currentUser } = useAuthenticator();
  const { url } = useRouteMatch();
  const history = useHistory();
  const { data, isSuccess, isLoading, isError } = usersStore.getPersonalFiles(
    user.person?.id + '',
  );
  const { mutateAsync } = usersStore.deletePersonalDoc();
  const [fileUrl, setUrl] = useState('');

  async function downloadDoc(data: ModuleAttachment | undefined) {
    await setUrl(
      await downloadPersonalDoc(
        data?.original_file_name + '',
        data?.file_type + '',
        '/attachments/download/personalDocs/',
      ),
    );
    var element = document.createElement('a');
    element.setAttribute('href', fileUrl);
    element.setAttribute('download', data?.original_file_name + '');

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  console.log(data);
  const actions = [
    {
      name: 'Download',
      privelege:
        user.id === currentUser?.id ? null : Privileges.CAN_DOWNLOAD_USERS_DOCUMENTS,
      handleAction: (_data?: string | number | undefined) =>
        _data ? downloadDoc(data?.data.data.find((e) => e.id == _data)?.attachment) : {},
    },
    {
      name: 'Delete',
      privelege:
        user.id === currentUser?.id ? null : Privileges.CAN_DELETE_USERS_DOCUMENTS,
      handleAction: async (
        _data?: string | number | EvaluationStudent | IEvaluationInfo | undefined,
      ) => {
        await mutateAsync(_data + '', {
          onSuccess() {
            toast.success('Document deleted successfully');
            queryClient.invalidateQueries(['user/personal_docs', user?.person?.id + '']);
            history.goBack();
          },
          onError(error: any) {
            toast.error(error.response.data.message);
          },
        });
      },
    },
  ];

  useEffect(() => {
    let formattedSubs: any = [];

    if (isSuccess && data?.data.data) {
      const filteredInfo = data?.data.data.map((attachment: any) =>
        pick(attachment, ['id', 'attachment', 'attachmentId']),
      );

      filteredInfo?.map((attachment: any) => {
        let filteredData: any = {
          id: attachment.id,
          'File name': attachment.attachment.original_file_name,
          'Attachment Description': attachment.attachment.description,
          'Attachment Purpose': attachment.attachment.purpose,
          'Date uploaded': attachment.attachment.created_on?.substring(0, 10),
        };
        formattedSubs.push(filteredData);
      });

      data?.data && setAttachments(formattedSubs);
    }
  }, [data?.data, isSuccess]);
  return (
    <>
      <div className="flex flex-col">
        <div className="mb-2">
          {user.id === currentUser?.id ? (
            <Link to={`${url}/new-personal-doc`}>
              <Button className="flex float-right">Upload new file</Button>
            </Link>
          ) : (
            <Permission privilege={Privileges.CAN_CREATE_USERS_DOCUMENTS}>
              <Link to={`${url}/new-personal-doc`}>
                <Button className="flex float-right">Upload new file</Button>
              </Link>
            </Permission>
          )}
        </div>
        <div>
          {isLoading && <Loader />}
          {isSuccess && attachments.length === 0 ? (
            <NoDataAvailable
              icon="evaluation"
              buttonLabel="Go back"
              title={'No personal files has been add so far!'}
              handleClick={() => history.goBack}
              description="Personal files have not been uploaded into the system yet"
              // privilege={Privileges.CAN_CREATE_PERSONAL_DOCUMENTS}
            />
          ) : isSuccess && attachments.length > 0 ? (
            <div>
              <Table<any>
                data={attachments}
                hide={['id']}
                uniqueCol={'id'}
                actions={actions}
              />
            </div>
          ) : isError ? (
            <NoDataAvailable
              icon="evaluation"
              showButton={false}
              title={'Something went wrong'}
              description="Something went wrong, try reloading the page or check your internet connection"
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
