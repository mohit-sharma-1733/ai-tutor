import { api } from './api';
import { Contact, Paginated } from '../types';

export const contactsService = {
  async list(cursor?: string) {
    const { data } = await api.get<Paginated<Contact>>('/contacts', {
      params: cursor ? { cursor } : undefined,
    });
    return data;
  },
};
