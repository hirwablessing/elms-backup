import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  CreateModuleInfo,
  CreatePrerequisites,
  ModuleInfo,
} from '../../types/services/modules.types';

type TableId = string | number;

class ModuleService {
  public async create(
    module: CreateModuleInfo,
  ): Promise<AxiosResponse<Response<ModuleInfo>>> {
    return await adminstrationAxios.post('/coursemodules/addModule', module);
  }

  public async fetchAll(): Promise<AxiosResponse<Response<ModuleInfo[]>>> {
    return await adminstrationAxios.get('/coursemodules/getAllModules');
  }

  public async getModuleById(id: TableId): Promise<AxiosResponse<Response<ModuleInfo>>> {
    return await adminstrationAxios.get(`/coursemodules/getModuleById/${id}`);
  }

  public async getModulesByProgram(
    programId: TableId,
  ): Promise<AxiosResponse<Response<ModuleInfo[]>>> {
    return await adminstrationAxios.get(
      `/coursemodules/getModulesByProgram/${programId}`,
    );
  }

  public async modifyModule(
    updated: CreateModuleInfo,
  ): Promise<AxiosResponse<Response<ModuleInfo[]>>> {
    return await adminstrationAxios.put(`/coursemodules/modifyModule`, updated);
  }

  public async addPrerequisites(
    prereq: CreatePrerequisites,
  ): Promise<AxiosResponse<Response<ModuleInfo>>> {
    return await adminstrationAxios.put(`/coursemodules/addPrerequists`, prereq);
  }
}

export const moduleService = new ModuleService();