import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbPathProps {
  items: BreadcrumbItem[];
}

const BreadcrumbPath: React.FC<BreadcrumbPathProps> = ({ items }) => {
  return (
    <nav className="text-sm text-gray-600">
      {items.map((item, index) => (
        <span key={item.href}>
          {index > 0 && <span className="mx-2">/</span>}
          <Link 
            href={item.href}
            className="hover:text-gray-900 hover:underline"
          >
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  );
};

export default BreadcrumbPath; 