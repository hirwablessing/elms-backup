import React, { useEffect, useState } from 'react';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Panel from '../../components/Atoms/custom/Panel';
import Heading from '../../components/Atoms/Text/Heading';
import Accordion from '../../components/Molecules/Accordion';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import Tiptap from '../../components/Molecules/editor/Tiptap';
import useAuthenticator from '../../hooks/useAuthenticator';
import { moduleMaterialStore } from '../../store/administration/module-material.store';
import { ParamType, Privileges } from '../../types';
import { MaterialType } from '../../types/services/module-material.types';
import { UserType } from '../../types/services/user.types';
import NewModuleMaterial from './NewModuleMaterial';
import NewModuleMaterialAttach from './NewModuleMaterialAttach';
import ShowModuleMaterial from './ShowModuleMaterial';

function ModuleMaterials() {
  const { id } = useParams<ParamType>();
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const { data: moduleMaterial, isLoading } =
    moduleMaterialStore.getModuleMaterialByModule(id);
  const moduleMaterials = moduleMaterial?.data.data || [];
  const { user } = useAuthenticator();
  const { search } = useLocation();
  const showMenu = new URLSearchParams(search).get('showMenus');
  const intakeProg = new URLSearchParams(search).get('intkPrg') || '';
  const [privileges, setPrivileges] = useState<string[]>();

  useEffect(() => {
    const _privileges = user?.user_roles
      ?.filter((role) => role.id === 1)[0]
      .role_privileges?.map((privilege) => privilege.name);
    if (_privileges) setPrivileges(_privileges);
  }, [user]);

  return (
    <Switch>
      <Route
        exact
        path={`${path}`}
        render={() => (
          <div className="flex flex-col gap-4 z-0 pt-6">
            <div className="flex justify-between items-center">
              <Heading fontSize="base" fontWeight="semibold">
                Learning materials ({moduleMaterial?.data.data.length || 0})
              </Heading>
            </div>
            <>
              {isLoading ? (
                <Loader />
              ) : moduleMaterials.length === 0 ? (
                <NoDataAvailable
                  showButton={
                    user?.user_type === UserType.INSTRUCTOR &&
                    (privileges?.includes(Privileges.CAN_CREATE_MODULE_MATERIALS)
                      ? true
                      : false)
                  }
                  icon="subject"
                  title={'No learning materials available'}
                  description={
                    'There are no learning materials currently added on this module'
                  }
                  handleClick={() => history.push(`${url}/add-material`)}
                />
              ) : (
                <div className="pt-3 w-2/5">
                  <Accordion>
                    {moduleMaterials.map((mat) => {
                      return (
                        <Panel
                          width="w-full"
                          bgColor="main"
                          key={mat.title}
                          title={mat.title}
                          badge={{
                            text: mat.type,
                            type: MaterialType[mat.type],
                          }}>
                          <div className="font-medium text-gray-600 text-sm py-4">
                            <Tiptap
                              editable={false}
                              viewMenu={false}
                              handleChange={() => {}}
                              content={mat.content}
                            />
                          </div>
                          {user?.user_type === UserType.INSTRUCTOR && (
                            <Permission
                              privilege={Privileges.CAN_CREATE_MODULE_MATERIALS}>
                              <Button
                                className="mt-2 mb-4 mx-20"
                                styleType="outline"
                                onClick={() =>
                                  history.push(
                                    `${url}/add-material/${mat.id}?showMenus=${showMenu}&intkPrg=${intakeProg}`,
                                  )
                                }>
                                Add supporting files
                              </Button>
                            </Permission>
                          )}
                          <ShowModuleMaterial materialId={mat.id + ''} />
                        </Panel>
                      );
                    })}
                  </Accordion>
                </div>
              )}
            </>
          </div>
        )}
      />
      {/* show module details */}
      <Route
        exact
        path={`${path}/add-material`}
        render={() => {
          return <NewModuleMaterial />;
        }}
      />
      {/* show module details */}
      <Route
        exact
        path={`${path}/add-material/:materialId`}
        render={() => {
          return <NewModuleMaterialAttach />;
        }}
      />
    </Switch>
  );
}

export default ModuleMaterials;
