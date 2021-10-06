import { useMutation, useQuery } from 'react-query';

import { institutionService } from '../services/administration/institution.service';

class InstitutionStore {
  create() {
    return useMutation('insitution', institutionService.create);
  }
  getAll() {
    return useMutation('institutions', institutionService.fetchAll);
  }
  getInstitutionById(id: string) {
    return useQuery(['insitution/id', id], () =>
      institutionService.getInstitutionById(id),
    );
  }
  updateInstitution() {
    return useMutation(institutionService.update);
  }
}

export const institutionStore = new InstitutionStore();
