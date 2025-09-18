import { useMemo, useState, type FormEvent } from 'react';

import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { hashPassword } from '@/utils/password';
import { useAuth } from '@/context/AuthContext';
import type { UserRecord } from '../../dataStore';

interface FormState {
  id?: number;
  name: string;
  email: string;
  role: string;
  password: string;
}

const ROLE_OPTIONS = [
  { value: 'admin_master', label: 'Admin master' },
  { value: 'editor', label: 'Editor' },
  { value: 'writer', label: 'Autor' },
  { value: 'viewer', label: 'Leitor' },
];

const DEFAULT_ROLE = 'editor';

const INITIAL_FORM: FormState = {
  id: undefined,
  name: '',
  email: '',
  role: DEFAULT_ROLE,
  password: '',
};

function getNextUserId(users: UserRecord[]): number {
  if (users.length === 0) {
    return 1;
  }
  return Math.max(...users.map((user) => user.id)) + 1;
}

const UserManagement = () => {
  const { users, saveUser, removeUser } = useUsers();
  const { user: currentUser, refreshUser } = useAuth();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.id - b.id);
  }, [users]);

  const isEditing = typeof formState.id === 'number';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    const trimmedName = formState.name.trim();
    const trimmedEmail = formState.email.trim();
    const trimmedRole = formState.role.trim() || DEFAULT_ROLE;

    if (!trimmedName || !trimmedEmail) {
      setErrorMessage('Preencha nome e e-mail para salvar o usuário.');
      return;
    }

    if (!isEditing && !formState.password) {
      setErrorMessage('Senha é obrigatória para novos usuários.');
      return;
    }

    const targetId = formState.id ?? getNextUserId(users);
    const existingUser = users.find((user) => user.id === formState.id);

    try {
      const passwordHash = formState.password
        ? await hashPassword(formState.password)
        : existingUser?.passwordHash ?? '';

      if (!passwordHash) {
        setErrorMessage('Informe uma senha válida.');
        return;
      }

      await saveUser({
        id: targetId,
        name: trimmedName,
        email: trimmedEmail,
        role: trimmedRole,
        passwordHash,
      });

      await refreshUser();

      setStatusMessage(isEditing ? 'Usuário atualizado com sucesso.' : 'Usuário criado com sucesso.');
      setFormState({ ...INITIAL_FORM });
    } catch (error) {
      console.error('Erro ao salvar usuário', error);
      setErrorMessage('Não foi possível salvar o usuário. Verifique os dados e tente novamente.');
    }
  };

  const handleEdit = (user: UserRecord) => {
    setFormState({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || DEFAULT_ROLE,
      password: '',
    });
    setStatusMessage(null);
    setErrorMessage(null);
  };

  const handleCancelEdit = () => {
    setFormState({ ...INITIAL_FORM });
    setStatusMessage(null);
    setErrorMessage(null);
  };

  const handleDelete = async (user: UserRecord) => {
    if (user.role === 'admin_master') {
      setErrorMessage('O usuário admin master não pode ser removido.');
      return;
    }

    if (!window.confirm(`Deseja realmente remover ${user.name}?`)) {
      return;
    }

    try {
      await removeUser(user.id);
      if (currentUser?.id === user.id) {
        await refreshUser();
      }
      if (formState.id === user.id) {
        setFormState({ ...INITIAL_FORM });
      }
      setStatusMessage('Usuário removido com sucesso.');
      setErrorMessage(null);
    } catch (error) {
      console.error('Erro ao remover usuário', error);
      setErrorMessage('Não foi possível remover o usuário.');
    }
  };

  return (
    <div className="p-6 space-y-8">
      <header className="space-y-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Gerenciamento de usuários</h1>
          <p className="text-sm text-muted">
            Cadastre novos integrantes, atualize informações e defina perfis de acesso da equipe.
          </p>
        </div>
        {statusMessage ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {statusMessage}
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-border bg-panel p-5 shadow-sm"
        >
          <div>
            <h2 className="text-lg font-medium">
              {isEditing ? 'Editar usuário' : 'Adicionar novo usuário'}
            </h2>
            <p className="text-xs text-muted">
              {isEditing
                ? 'Atualize os dados e, se desejar, redefina a senha do integrante selecionado.'
                : 'Preencha os dados para convidar alguém da equipe.'}
            </p>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Nome</Label>
              <Input
                id="user-name"
                value={formState.name}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Nome completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">E-mail</Label>
              <Input
                id="user-email"
                type="email"
                value={formState.email}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="nome@exemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Perfil de acesso</Label>
              <Select
                id="user-role"
                value={formState.role}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, role: event.target.value }))
                }
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                {!ROLE_OPTIONS.some((option) => option.value === formState.role) ? (
                  <option value={formState.role}>{formState.role}</option>
                ) : null}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-password">
                {isEditing ? 'Nova senha (opcional)' : 'Senha temporária'}
              </Label>
              <Input
                id="user-password"
                type="password"
                value={formState.password}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder={isEditing ? 'Deixe em branco para manter a atual' : 'Defina uma senha inicial'}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit">{isEditing ? 'Salvar alterações' : 'Criar usuário'}</Button>
            {isEditing ? (
              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                Cancelar edição
              </Button>
            ) : null}
          </div>
        </form>

        <div className="rounded-lg border border-border bg-panel p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-medium">Usuários cadastrados</h2>
              <p className="text-xs text-muted">
                Clique em “Editar” para ajustar dados ou em “Remover” para excluir alguém da equipe.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={() => setFormState({ ...INITIAL_FORM })}>
              Novo cadastro
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="w-40">Perfil</TableHead>
                <TableHead className="w-36 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide">
                      {user.role || '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => handleDelete(user)}
                        disabled={user.role === 'admin_master'}
                      >
                        Remover
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {sortedUsers.length === 0 ? (
              <TableCaption>Nenhum usuário cadastrado até o momento.</TableCaption>
            ) : null}
          </Table>
        </div>
      </section>
    </div>
  );
};

export default UserManagement;
