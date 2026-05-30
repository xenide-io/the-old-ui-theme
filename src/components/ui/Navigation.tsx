import { IconChevronLeft, IconChevronRight } from "@/components/icons";
import { cn } from "@/lib/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  label?: string;
  className?: string;
}

export function Breadcrumbs({ items, label = "Breadcrumb", className }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={cn("ph-breadcrumbs", className)}>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="contents">
          {index > 0 ? <span className="ph-breadcrumb-sep" aria-hidden="true">/</span> : null}
          {item.current || !item.href ? (
            <span className="ph-breadcrumb-current" aria-current={item.current ? "page" : undefined}>
              {item.label}
            </span>
          ) : (
            <a href={item.href} className="ph-breadcrumb-link">
              {item.label}
            </a>
          )}
        </span>
      ))}
    </nav>
  );
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  label?: string;
  compact?: boolean;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  label = "Pagination",
  compact = false,
  className,
}: PaginationProps) {
  const pages = compact ? [Math.max(1, page - 1), page, Math.min(totalPages, page + 1)] : [1, 2, 3, totalPages];
  const uniquePages = Array.from(new Set(pages)).filter((n) => n >= 1 && n <= totalPages);

  return (
    <nav aria-label={label} className={cn("ph-pagination", className)}>
      <button
        type="button"
        className="ph-pagination-btn"
        disabled={page <= 1}
        aria-label="Previous page"
        onClick={() => onPageChange?.(page - 1)}
      >
        <IconChevronLeft className="mx-auto h-4 w-4" aria-hidden />
      </button>
      {uniquePages.map((pageNumber, index) => (
        <span key={pageNumber} className="contents">
          {!compact && index === uniquePages.length - 1 && pageNumber > 4 ? (
            <span className="ph-pagination-ellipsis" aria-hidden="true">...</span>
          ) : null}
          <button
            type="button"
            className={cn("ph-pagination-btn", pageNumber === page && "ph-pagination-btn-active")}
            aria-current={pageNumber === page ? "page" : undefined}
            onClick={() => onPageChange?.(pageNumber)}
          >
            {pageNumber}
          </button>
        </span>
      ))}
      <button
        type="button"
        className="ph-pagination-btn"
        disabled={page >= totalPages}
        aria-label="Next page"
        onClick={() => onPageChange?.(page + 1)}
      >
        <IconChevronRight className="mx-auto h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}
