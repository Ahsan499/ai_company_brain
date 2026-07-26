import { Link } from 'react-router-dom';

const TaskComment = ({ comment }) => {
  if (!comment) return null;

  return (
    <div className="flex items-start gap-3">
      <Link
        to={`/dashboard/users/${comment.userId}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#1D4ED8] text-white text-[10px] font-semibold ring-2 ring-white shadow-sm"
      >
        {comment.initials}
      </Link>
      <div className="min-w-0 flex-1 rounded-[14px] border border-border/45 bg-slate-50/70 px-3 py-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <Link
            to={`/dashboard/users/${comment.userId}`}
            className="text-[12.5px] font-semibold text-heading hover:text-primary truncate"
          >
            {comment.userName}
          </Link>
          <span className="shrink-0 text-[10.5px] font-medium text-slate-400">{comment.time}</span>
        </div>
        <p className="mt-1 text-[12.5px] text-secondaryText leading-relaxed">{comment.text}</p>
      </div>
    </div>
  );
};

export default TaskComment;
