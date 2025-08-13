import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const breadcrumbNameMap: Record<string, string> = {
  '/editor': 'Editor',
  '/book': 'Livro',
  '/characters': 'Personagens',
  '/world': 'Mundo',
  '/world/locations': 'Locais',
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);
  const crumbs = pathnames.map((_, index) => {
    const to = '/' + pathnames.slice(0, index + 1).join('/');
    const label = breadcrumbNameMap[to] || decodeURIComponent(pathnames[index]);
    return { to, label };
  });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex text-sm text-gray-600">
        {crumbs.map((crumb, index) => (
          <li key={crumb.to} className="flex items-center">
            {index > 0 && <span className="mx-1">›</span>}
            {index < crumbs.length - 1 ? (
              <Link to={crumb.to} className="hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span>{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
