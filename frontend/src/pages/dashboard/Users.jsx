import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { UsersRound, UserPlus } from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/dashboard/EmptyState';
import UserFilterBar from '../../components/users/UserFilterBar';
import UserTable from '../../components/users/UserTable';
import UserCard from '../../components/users/UserCard';
import BulkActionBar from '../../components/users/BulkActionBar';
import InviteUserModal from '../../components/users/InviteUserModal';
import { USERS, filterUsers } from '../../components/users/userData';

const PAGE_SIZE = 8;

const Users = () => {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [organizationId, setOrganizationId] = useState('all');
  const [view, setView] = useState('table');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [rows, setRows] = useState(USERS);

  const filtered = useMemo(
    () =>
      filterUsers(rows, {
        query,
        role,
        department,
        status,
        organizationId,
      }),
    [rows, query, role, department, status, organizationId]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  const toggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const ids = pageItems.map((u) => u.id);
    const allOnPage = ids.length > 0 && ids.every((id) => selectedIds.includes(id));
    if (allOnPage) {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  const clearSelection = () => setSelectedIds([]);

  const bulkDeactivate = () => {
    setRows((prev) =>
      prev.map((u) =>
        selectedIds.includes(u.id) ? { ...u, status: 'suspended' } : u
      )
    );
    clearSelection();
  };

  const bulkRoleChange = (nextRole) => {
    setRows((prev) =>
      prev.map((u) => (selectedIds.includes(u.id) ? { ...u, role: nextRole } : u))
    );
    clearSelection();
  };

  const resetFilters = () => {
    setQuery('');
    setRole('all');
    setDepartment('all');
    setStatus('all');
    setOrganizationId('all');
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6 pb-24 sm:pb-20">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary shadow-sm ring-1 ring-primary/10">
              <UsersRound size={17} strokeWidth={2} />
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/12">
              {rows.length} people
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
            Users
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
            Manage people, roles, and access across every organization workspace.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => setInviteOpen(true)}
          className="h-11 rounded-xl gap-2 text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.28)]"
        >
          <UserPlus size={16} strokeWidth={2.25} />
          Invite User
        </Button>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
      >
        <UserFilterBar
          query={query}
          onQueryChange={(v) => {
            setQuery(v);
            resetPage();
          }}
          role={role}
          onRoleChange={(v) => {
            setRole(v);
            resetPage();
          }}
          department={department}
          onDepartmentChange={(v) => {
            setDepartment(v);
            resetPage();
          }}
          status={status}
          onStatusChange={(v) => {
            setStatus(v);
            resetPage();
          }}
          organizationId={organizationId}
          onOrganizationChange={(v) => {
            setOrganizationId(v);
            resetPage();
          }}
          view={view}
          onViewChange={setView}
        />
      </motion.div>

      {filtered.length === 0 ? (
        <div className="rounded-[20px] border border-border/45 bg-white/85 py-6 shadow-sm">
          <EmptyState
            icon={UsersRound}
            title="No users found"
            description="Try another search or clear filters to see everyone in the directory."
            action={
              <Button type="button" variant="secondary" onClick={resetFilters} className="rounded-xl">
                Clear filters
              </Button>
            }
          />
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
          {pageItems.map((user, i) => (
            <UserCard
              key={user.id}
              user={user}
              index={i}
              selected={selectedIds.includes(user.id)}
              onToggle={toggle}
            />
          ))}
        </div>
      ) : (
        <UserTable
          users={pageItems}
          selectedIds={selectedIds}
          onToggle={toggle}
          onToggleAll={toggleAll}
        />
      )}

      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12.5px] text-secondaryText">
            Page{' '}
            <span className="font-semibold text-heading tabular-nums">{safePage}</span>
            {' '}of{' '}
            <span className="font-semibold text-heading tabular-nums">{totalPages}</span>
            {' · '}
            <span className="font-semibold text-heading tabular-nums">{filtered.length}</span>
            {' '}results
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-10 rounded-xl text-[13px] font-semibold bg-white/90 disabled:opacity-40"
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-10 rounded-xl text-[13px] font-semibold bg-white/90 disabled:opacity-40"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <BulkActionBar
        count={selectedIds.length}
        onClear={clearSelection}
        onDeactivate={bulkDeactivate}
        onRoleChange={bulkRoleChange}
      />

      <InviteUserModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
};

export default Users;
