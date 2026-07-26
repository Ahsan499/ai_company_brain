import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Filter,
  Folder,
  FolderPlus,
  LayoutGrid,
  List,
  Search,
  Upload,
  Files as FilesIcon,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/dashboard/EmptyState';
import StorageCard from '../../components/profile/StorageCard';
import FileCard from '../../components/files/FileCard';
import FileRow, { FileMobileRow } from '../../components/files/FileRow';
import FolderCard, { FolderRow } from '../../components/files/FolderCard';
import FileDetailDrawer from '../../components/files/FileDetailDrawer';
import UploadDropzone from '../../components/files/UploadDropzone';
import CreateFolderModal from '../../components/files/CreateFolderModal';
import {
  FILE_TYPES,
  FILE_TYPE_META,
  STORAGE,
  filterAndSortFiles,
  filterFolders,
  getBreadcrumb,
  getChildFolders,
  getFileById,
  getFilesInFolder,
} from '../../components/files/fileData';
import { PROJECTS } from '../../components/projects/projectData';

const selectClass =
  'h-10 rounded-xl border border-border/60 bg-white px-3 text-[12.5px] font-medium text-heading focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12';

const Files = () => {
  const navigate = useNavigate();
  const { id: routeFileId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const folderId = searchParams.get('folder') || null;

  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [projectId, setProjectId] = useState('all');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('grid');
  const [folderOpen, setFolderOpen] = useState(false);
  const [toast, setToast] = useState('');

  const breadcrumb = useMemo(() => getBreadcrumb(folderId), [folderId]);
  const childFolders = useMemo(
    () => filterFolders(getChildFolders(folderId), query),
    [folderId, query]
  );
  const folderFiles = useMemo(() => getFilesInFolder(folderId), [folderId]);
  const files = useMemo(
    () => filterAndSortFiles(folderFiles, { query, type, projectId, sort }),
    [folderFiles, query, type, projectId, sort]
  );

  const openFolder = (id) => {
    setSearchParams(id ? { folder: id } : {});
  };

  const openFile = useCallback(
    (fileId) => {
      const qs = folderId ? `?folder=${folderId}` : '';
      navigate(`/dashboard/files/${fileId}${qs}`);
    },
    [navigate, folderId]
  );

  const closeFile = useCallback(() => {
    const qs = folderId ? `?folder=${folderId}` : '';
    navigate(`/dashboard/files${qs}`);
  }, [navigate, folderId]);

  const activeFile = useMemo(() => {
    if (!routeFileId) return null;
    return getFileById(routeFileId);
  }, [routeFileId]);

  useEffect(() => {
    if (routeFileId && !activeFile) {
      navigate('/dashboard/files', { replace: true });
    }
  }, [routeFileId, activeFile, navigate]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const isEmpty = childFolders.length === 0 && files.length === 0;

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 sm:space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary shadow-sm ring-1 ring-primary/10">
              <FilesIcon size={17} strokeWidth={2} />
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/12">
              Library
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-heading tracking-tight leading-tight">
            Files
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] sm:text-[14px] text-secondaryText leading-relaxed">
            Central document repository — folders, attachments, and project-linked files.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="w-full sm:w-[240px]">
            <StorageCard used={STORAGE.usedGb} total={STORAGE.totalGb} delay={0.05} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setFolderOpen(true)}
              className="h-11 rounded-xl gap-2 text-[13px] font-semibold bg-white"
            >
              <FolderPlus size={15} />
              New Folder
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => setToast('Upload queued (demo only)')}
              className="h-11 rounded-xl gap-2 text-[13px] font-semibold shadow-[0_6px_16px_rgba(37,99,235,0.28)]"
            >
              <Upload size={15} />
              Upload File
            </Button>
          </div>
        </div>
      </motion.section>

      <nav
        className="flex flex-wrap items-center gap-1 text-[12.5px] font-semibold text-secondaryText"
        aria-label="Breadcrumb"
      >
        <button
          type="button"
          onClick={() => openFolder(null)}
          className="hover:text-primary transition-colors"
        >
          Root
        </button>
        {breadcrumb.map((f) => (
          <span key={f.id} className="inline-flex items-center gap-1">
            <ChevronRight size={13} className="text-slate-300" />
            <button
              type="button"
              onClick={() => openFolder(f.id)}
              className="hover:text-primary transition-colors text-heading"
            >
              {f.name}
            </button>
          </span>
        ))}
      </nav>

      <UploadDropzone onClick={() => setToast('Upload queued (demo only)')} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="
          flex flex-col gap-3
          rounded-[20px] border border-border/45 bg-white/85 backdrop-blur-md
          p-3 sm:p-3.5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]
        "
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files and folders..."
              className="
                w-full h-10 rounded-xl border border-border/60 bg-white/90
                pl-10 pr-3 text-[13px] text-heading placeholder:text-slate-400
                focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12
              "
              aria-label="Search files"
            />
          </div>
          <div className="inline-flex rounded-xl border border-border/60 bg-slate-50/80 p-0.5" role="group">
            <button
              type="button"
              onClick={() => setView('grid')}
              aria-pressed={view === 'grid'}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-[10px] ${
                view === 'grid'
                  ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                  : 'text-slate-400 hover:text-heading'
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-[10px] ${
                view === 'list'
                  ? 'bg-white text-primary shadow-sm ring-1 ring-primary/10'
                  : 'text-slate-400 hover:text-heading'
              }`}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 px-1">
            <Filter size={12} />
            Filters
          </span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={selectClass}
          >
            <option value="all">All types</option>
            {FILE_TYPES.map((t) => (
              <option key={t} value={t}>
                {FILE_TYPE_META[t].label}
              </option>
            ))}
          </select>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className={`${selectClass} max-w-[200px]`}
          >
            <option value="all">All projects</option>
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
            <option value="name">Sort: Name</option>
            <option value="date">Sort: Date</option>
            <option value="size">Sort: Size</option>
          </select>
        </div>
      </motion.div>

      {isEmpty ? (
        <div className="rounded-[20px] border border-border/45 bg-white/85 py-6">
          <EmptyState
            icon={FilesIcon}
            title="This folder is empty"
            description="Upload a file or create a folder to get started."
            action={
              <Button
                type="button"
                variant="primary"
                className="rounded-xl"
                onClick={() => setToast('Upload queued (demo only)')}
              >
                Upload File
              </Button>
            }
          />
        </div>
      ) : view === 'grid' ? (
        <div className="space-y-5">
          {childFolders.length > 0 && (
            <div>
              <h2 className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-slate-400 px-0.5">
                Folders
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
                {childFolders.map((f, i) => (
                  <FolderCard key={f.id} folder={f} index={i} onOpen={openFolder} />
                ))}
              </div>
            </div>
          )}
          {files.length > 0 && (
            <div>
              <h2 className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-slate-400 px-0.5">
                Files
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
                {files.map((f, i) => (
                  <FileCard key={f.id} file={f} index={i} onOpen={openFile} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-2 md:hidden">
            {childFolders.map((f) => (
              <FolderRow key={f.id} folder={f} onOpen={openFolder} />
            ))}
            {files.map((f) => (
              <FileMobileRow key={f.id} file={f} onOpen={openFile} />
            ))}
          </div>

          <div className="hidden md:block overflow-hidden rounded-[20px] border border-border/45 bg-white/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
            <div className="overflow-x-auto dashboard-scrollbar">
              <table className="w-full min-w-[880px] text-left">
                <thead>
                  <tr className="border-b border-border/50 bg-slate-50/80">
                    {['Name', 'Type', 'Size', 'Project', 'Uploaded by', 'Date', ''].map((h) => (
                      <th
                        key={h || 'actions'}
                        className="px-3 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {childFolders.map((f) => (
                    <tr
                      key={f.id}
                      className="border-b border-border/35 hover:bg-slate-50/70 cursor-pointer"
                      onClick={() => openFolder(f.id)}
                    >
                      <td className="px-3 py-3" colSpan={6}>
                        <span className="inline-flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFF7ED] to-[#FED7AA] text-amber-700">
                            <Folder size={15} />
                          </span>
                          <span className="text-[13.5px] font-semibold text-heading">{f.name}</span>
                          <span className="text-[11.5px] text-secondaryText">Folder</span>
                        </span>
                      </td>
                      <td />
                    </tr>
                  ))}
                  {files.map((f, i) => (
                    <FileRow key={f.id} file={f} index={i} onOpen={openFile} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AnimatePresenceToast toast={toast} />

      <FileDetailDrawer
        open={Boolean(routeFileId && activeFile)}
        file={activeFile}
        onClose={closeFile}
      />
      <CreateFolderModal
        open={folderOpen}
        onClose={() => setFolderOpen(false)}
        currentFolderId={folderId}
      />
    </div>
  );
};

const AnimatePresenceToast = ({ toast }) => {
  if (!toast) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="
        fixed bottom-6 left-1/2 z-[90] -translate-x-1/2
        rounded-xl border border-border/50 bg-heading px-4 py-2.5
        text-[13px] font-semibold text-white shadow-xl
      "
    >
      {toast}
    </motion.div>
  );
};

export default Files;
